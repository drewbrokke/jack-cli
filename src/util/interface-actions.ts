import {
	notifyError,
	notifyInfo,
	notifySuccess,
} from '../interface/notification';
import { markSHA } from '../redux/action-creators';
import { store } from '../redux/store';
import {
	copyCommitMessageToClipboard,
	copySHAToClipboard,
	openCommitRangeDiffFile,
	openFilesFromCommitRange,
} from './external-commands';
import { sortSHAs } from './git-util';

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

// Helpers

const doCommandWithMaybeMarkedCommit =
	async (command: (SHA1: string, SHA2: string) => any, errorText: string) => {
		const markedSHA = getMarkedSHA();
		const SHA = getSHA();

		try {
			if (markedSHA) {
				const [ancestorSHA, childSHA] =
					await sortSHAs(markedSHA, SHA);

				await command(ancestorSHA, childSHA);
			} else {
				await command(SHA, SHA);
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

const unmarkAnchorCommit = () => {
	store.dispatch(markSHA(null));

	notifyInfo(`Unmarked commit`);
};
