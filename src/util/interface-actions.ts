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
	openFilesFromCommit,
	openFilesFromCommitRange,
	openSingleCommitDiffFile,
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
	const markedSHA = getMarkedSHA();
	const SHA = getSHA();

	try {
		if (markedSHA) {
			const [ancestorSHA, childSHA] =
				await sortSHAs(markedSHA, SHA);

			spawnDiff(screen, ancestorSHA, childSHA);
		} else {
			spawnDiff(screen, SHA, SHA);
		}
	} catch (errorMessage) {
		notifyError(`Could not get diff:\n\n${errorMessage}`);
	}

	if (markedSHA) {
		unmarkAnchorCommit();
	}
};

export const doDifftool = async () => {
	const markedSHA = getMarkedSHA();
	const SHA = getSHA();

	try {
		if (markedSHA) {
			const [ancestorSHA, childSHA] =
				await sortSHAs(markedSHA, SHA);

			gitDiffTool(ancestorSHA, childSHA);
		} else {
			gitDiffTool(SHA, SHA);
		}
	} catch (errorMessage) {
		notifyError(`Could not launch difftool:\n\n${errorMessage}`);
	}

	if (markedSHA) {
		unmarkAnchorCommit();
	}
};

export const doDiffNameOnly = async (screen: IScreen) => {
	const markedSHA = getMarkedSHA();
	const SHA = getSHA();

	try {
		if (markedSHA) {
			const [ancestorSHA, childSHA] =
				await sortSHAs(markedSHA, SHA);

			spawnDiffNameOnly(screen, ancestorSHA, childSHA);
		} else {
			spawnDiffNameOnly(screen, SHA, SHA);
		}
	} catch (errorMessage) {
		notifyError(`Could not get diff list:;\n\n${errorMessage}`);
	}

	if (markedSHA) {
		unmarkAnchorCommit();
	}
};

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

export const doOpenDiffInEditor = async () => {
	const markedSHA = getMarkedSHA();

	try {
		if (markedSHA) {
			const [ancestorSHA, childSHA] =
				await sortSHAs(markedSHA, getSHA());

			await openCommitRangeDiffFile(ancestorSHA, childSHA);
		} else {
			await openSingleCommitDiffFile(getSHA());
		}
	} catch (errorMessage) {
		notifyError(`Could not open diff:\n\n${errorMessage}`);
	}

	if (markedSHA) {
		unmarkAnchorCommit();
	}
};

export const doOpenFilesInEditor = async () => {
	const markedSHA = getMarkedSHA();
	const SHA = getSHA();

	try {
		if (markedSHA) {
			const [ancestorSHA, childSHA] =
				await sortSHAs(markedSHA, SHA);

			await openFilesFromCommitRange(ancestorSHA, childSHA);
		} else {
			await openFilesFromCommit(getSHA());
		}
	} catch (errorMessage) {
		notifyError(`Could not open the files:\n\n${errorMessage}`);
	}

	if (markedSHA) {
		unmarkAnchorCommit();
	}
};

export const doStartInteractiveRebase = async (screen: IScreen) =>
	screen.exec(
		'git', ['rebase', '-i', `${getSHA()}^`], {},
		() => process.exit(0));

// Helpers

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
