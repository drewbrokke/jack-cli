import * as open from 'open';
import * as path from 'path';

import { writeToClipboard } from './clipboard-util';
import { gitCommitMessage, gitDiffNameOnly, gitTopLevel } from './git-util';

export const copyCommitMessageToClipboard = async (
	SHA: string,
): Promise<any> => {
	const message = await gitCommitMessage(SHA);

	await writeToClipboard(message);

	return message;
};

export const copySHAToClipboard = async (SHA: string): Promise<void> =>
	await writeToClipboard(SHA);

export const openFile = async (filePath: string) => await open(filePath);

export const openFilesFromCommitRange = async (
	SHA1: string,
	SHA2: string,
): Promise<any> => {
	const topLevel = await gitTopLevel();

	const filesString = await gitDiffNameOnly(SHA1, SHA2);

	const filesArray = filesString
		.split('\n')
		.map((file) => path.join(topLevel, file));

	return Promise.all(filesArray.map(openFile));
};
