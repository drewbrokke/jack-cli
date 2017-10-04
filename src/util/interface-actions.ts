import {
	notifyError,
	notifyInfo,
	notifySuccess,
} from '../interface/notification';
import { markSHA, unmarkSHA } from '../redux/action-creators';
import { store } from '../redux/store';
import { IScreen } from '../types/types';
import {
	copyCommitMessageToClipboard,
	copySHAToClipboard,
	openCommitRangeDiffFile,
	openFilesFromCommitRange,
} from './external-commands';
import {
	gitCherryPick,
	gitCherryPickAbort,
	gitDiffTool,
	sortSHAs,
} from './git-util';

export const doCherryPick = async () => {
	const SHA = getSHA();

	notifyInfo(`Attempting to cherry-pick commit ${SHA}`);

	try {
		await gitCherryPick(SHA);

		notifySuccess(`Successfully cherry-picked commit ${SHA}`);
	} catch (errorMessage) {
		notifyError(
			`Unable to cherry-pick commit ${SHA}:

${errorMessage}

Aborting cherry-pick.`);

		gitCherryPickAbort();
	}
};

export const doCopyCommitMessage = async () => {
	try {
		const message = await copyCommitMessageToClipboard(getSHA());

		notifySuccess(`Copied commit message to the clipoard:\n\n"${message}"`);
	} catch (errorMessage) {
		notifyError(
			`Could not copy the commit message to the clipboard:

${errorMessage}`);
	}
};

export const doCopyCommitSHA = async () => {
	const SHA = getSHA();

	try {
		await copySHAToClipboard(SHA);

		notifySuccess(`Copied SHA to the clipboard: ${SHA}`);
	} catch (errorMessage) {
		notifyError(`Could not copy the SHA to the clipboard:\n\n${errorMessage}`);
	}
};

export const doDiff = async (screen: IScreen) => {
	doCommandWithMaybeMarkedCommit(
		(SHA1: string, SHA2: string) => spawnDiff(screen, SHA1, SHA2),
		'Could not get diff');
};

export const doDiffNameOnly = async (screen: IScreen) => {
	doCommandWithMaybeMarkedCommit(
		(SHA1: string, SHA2: string) => spawnDiffNameOnly(screen, SHA1, SHA2),
		'Could not get diff list');
};

export const doDifftool = async () =>
	doCommandWithMaybeMarkedCommit(gitDiffTool, 'Could not launch difftool');

export const doOpenDiffInEditor = async () =>
	doCommandWithMaybeMarkedCommit(
		openCommitRangeDiffFile, 'Could not open diff');

export const doOpenFilesInEditor = async () =>
	doCommandWithMaybeMarkedCommit(
		openFilesFromCommitRange, 'Could not open the files');

export const doMarkCommit = () => {
	const markedSHA = getMarkedSHA();
	const commit = getSHA();

	if (markedSHA && markedSHA === commit) {
		unmarkAnchorCommit();
	} else {
		store.dispatch(markSHA(commit));

		notifyInfo(`Marked commit for diffing: ${commit}`);
	}
};

export const doStartInteractiveRebase = async (screen: IScreen) =>
	screen.exec(
		'git', ['rebase', '-i', `${getSHA()}^`], {},
		() => process.exit(0));

// Helpers

const doCommandWithMaybeMarkedCommit =
	async (command: (SHA1: string, SHA2: string) => any, errorText: string) => {
		const markedSHA = getMarkedSHA();
		const SHA = getSHA();

		try {
			if (markedSHA) {
				const [ancestorSHA, childSHA] =
					await sortSHAs(markedSHA, SHA);

				command(ancestorSHA, childSHA);
			} else {
				command(SHA, SHA);
			}
		} catch (errorMessage) {
			notifyError(`${errorText}:\n\n${errorMessage}`);
		}

		if (markedSHA) {
			unmarkAnchorCommit();
		}
	};

const getMarkedSHA = () => store.getState().markedSHA;
const getSHA = () => store.getState().SHA;

const spawnDiff = (screen: IScreen, SHA1: string, SHA2: string) =>
	screen.spawn(
		'git',
		['diff', `${SHA1}^..${SHA2}`, '--patch', '--stat-width=1000'], {});

const spawnDiffNameOnly = (screen: IScreen, SHA1: string, SHA2: string) =>
	screen.spawn('git', ['diff', `${SHA1}^..${SHA2}`, '--name-only'], {});

const unmarkAnchorCommit = () => {
	store.dispatch(unmarkSHA());

	notifyInfo(`Unmarked commit`);
};
