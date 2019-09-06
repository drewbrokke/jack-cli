import {
	notifyError,
	notifyInfo,
	notifySuccess,
} from '../interface/notification';
import { markSHA } from '../state/action-creators';
import { store } from '../state/store';
import {
	copyCommitMessageToClipboard,
	copySHAToClipboard,
	openFilesFromCommitRange,
} from './external-commands';
import { sortSHAs } from './git-util';

export const doCopyCommitMessage = async () => {
	try {
		const message = await copyCommitMessageToClipboard(getSHA());

		notifySuccess(`Copied commit message to the clipoard:\n\n"${message}"`);
	} catch (error) {
		notifyError(
			`Could not copy the commit message to the clipboard:\n\n${
				error.message
			}`,
		);
	}
};

export const doCopyCommitSHA = async () => {
	try {
		const SHA = getSHA();

		await copySHAToClipboard(SHA);

		notifySuccess(`Copied SHA to the clipboard: ${SHA}`);
	} catch (error) {
		notifyError(
			`Could not copy the SHA to the clipboard:\n\n${error.message}`,
		);
	}
};

export const doOpenFilesInEditor = async () =>
	doCommandWithMaybeMarkedCommit(
		openFilesFromCommitRange,
		'Could not open the files',
	);

export const doMarkCommit = () => {
	const commit = getSHA();

	if (getMarkedSHA() === commit) {
		unmarkAnchorCommit();
	} else {
		store.dispatch(markSHA(commit));

		notifyInfo(`Marked commit for diffing: ${commit}`);
	}
};

// Helpers

const doCommandWithMaybeMarkedCommit = async (
	command: (SHA1: string, SHA2: string) => any,
	errorText: string,
) => {
	const markedSHA = getMarkedSHA();

	try {
		const SHA = getSHA();

		const sorted = markedSHA ? await sortSHAs(markedSHA, SHA) : [SHA, SHA];

		await command(sorted[0], sorted[1]);
	} catch (error) {
		notifyError(`${errorText}:\n\n${error.message}`);
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
