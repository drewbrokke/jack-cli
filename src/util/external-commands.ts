import * as clipboardy from 'clipboardy';
import { writeFile } from 'fs';
import * as opn from 'opn';
import { homedir } from 'os';
import * as path from 'path';

import {
	gitCommitMessage,
	gitDiff,
	gitDiffNameOnly,
	gitTopLevel,
} from './git-util';
import { KEY_TEMP_FILES, stash } from './stash';

export const copyCommitMessageToClipboard = (SHA: string): Promise<any> =>
	gitCommitMessage(SHA)
		.then((message: string) => {
			clipboardy.write(message);

			return message;
		});

export const copySHAToClipboard = (SHA: string): Promise<any> =>
	clipboardy.write(SHA);

export const openCommitRangeDiffFile =
	(ancestorSHA: string, childSHA: string): Promise<any> =>
		gitDiff(ancestorSHA, childSHA)
			.then((content: string) =>
				openTempFile(
					ancestorSHA === childSHA
						? `temp-patch-${ancestorSHA}-at-${new Date().getTime()}.diff`
						: `temp-patch-${ancestorSHA}-${childSHA}-at-${new Date().getTime()}.diff`,
					content));

export const openFilesFromCommitRange =
	async (SHA1: string, SHA2: string): Promise<any> => {

		const topLevel = await gitTopLevel();

		const filesString = await gitDiffNameOnly(SHA1, SHA2);

		const filesArray = filesString.split('\n')
			.map((file) => path.join(topLevel, file));

		return Promise.all(filesArray.map(opn));
	};

const openTempFile = (fileName: string, content: string): Promise<any> => {
	const filePath = path.join(homedir(), fileName);

	return new Promise((resolve, reject) => {
		writeFile(filePath, content, { encoding: 'utf8' }, (writeFileError) => {
			if (writeFileError) {
				return reject(writeFileError);
			}

			if (stash.has(KEY_TEMP_FILES)) {
				stash.set(
					KEY_TEMP_FILES,
					stash.get(KEY_TEMP_FILES).concat([filePath]));
			} else {
				stash.set(KEY_TEMP_FILES, [filePath]);
			}

			opn(filePath, { wait: false })
				.then((opnProcess) =>
					opnProcess.on('close', () => resolve(filePath)))
				.catch((opnError) => reject(opnError));
		});
	});
};
