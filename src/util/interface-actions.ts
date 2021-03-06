import { notifier } from '../interface/notification';
import { Actions } from '../state/actions';
import { store } from '../state/store';
import { getConfigFilePath } from './config-util';
import {
	copyCommitMessageToClipboard,
	copySHAToClipboard,
	openFile,
	openFilesFromCommitRange,
} from './external-commands';
import { sortSHAs } from './git-util';

export const doCopyCommitMessage = async () => {
	try {
		const message = await copyCommitMessageToClipboard(getSHA());

		notifier.success(
			`Copied commit message to the clipoard:\n\n"${message}"`,
		);
	} catch (error) {
		notifier.error(
			`Could not copy the commit message to the clipboard:\n\n${error.message}`,
		);
	}
};

export const doCopyCommitSHA = async () => {
	try {
		const SHA = getSHA();

		await copySHAToClipboard(SHA);

		notifier.success(`Copied SHA to the clipboard: ${SHA}`);
	} catch (error) {
		notifier.error(
			`Could not copy the SHA to the clipboard:\n\n${error.message}`,
		);
	}
};

export const doOpenConfigFile = async () => {
	try {
		await openFile(getConfigFilePath());

		notifier.success(`Opened the config file at: ${getConfigFilePath()}`);
	} catch (error) {
		notifier.error(
			`Could not open the config file at ${getConfigFilePath()}:\n\n${
				error.message
			}`,
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
		Actions.markSHA(commit);

		notifier.info(`Marked commit for diffing: ${commit}`);
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
		notifier.error(`${errorText}:\n\n${error.message}`);
	}

	if (markedSHA) {
		unmarkAnchorCommit();
	}
};

const getMarkedSHA = () => store.getState().markedSHA;
const getSHA = () => store.getState().SHA;

const unmarkAnchorCommit = () => {
	Actions.markSHA(null);

	notifier.info(`Unmarked commit`);
};
