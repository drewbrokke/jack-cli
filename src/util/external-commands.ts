import * as clipboardy from 'clipboardy';
import opn = require('opn');
import * as path from 'path';

import { gitCommitMessage, gitDiffNameOnly, gitTopLevel } from './git-util';

export const copyCommitMessageToClipboard = (SHA: string): Promise<any> =>
	gitCommitMessage(SHA).then((message: string) => {
		clipboardy.write(message);

		return message;
	});

export const copySHAToClipboard = (SHA: string): Promise<any> =>
	clipboardy.write(SHA);

export const openFilesFromCommitRange = async (
	SHA1: string,
	SHA2: string,
): Promise<any> => {
	const topLevel = await gitTopLevel();

	const filesString = await gitDiffNameOnly(SHA1, SHA2);

	const filesArray = filesString
		.split('\n')
		.map((file) => path.join(topLevel, file));

	return Promise.all(filesArray.map((file) => opn(file)));
};
