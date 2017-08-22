import * as clipboardy from 'clipboardy';
import { unlinkSync, writeFile } from 'fs';
import * as opn from 'opn';
import { homedir } from 'os';
import * as path from 'path';

import {
	gitCherryPick,
	gitCherryPickAbort,
	gitCommitMessage,
	gitDiff,
	gitDiffNameOnly,
	gitShow,
	gitTopLevel,
} from './git-util';

export function cherryPickCommit(SHA: string): Promise<any> {
	return gitCherryPick(SHA)
		.catch((errorMessage: string) => {
			gitCherryPickAbort();

			return Promise.reject(errorMessage);
		});
}

export function copyCommitMessageToClipboard(SHA: string): Promise<any> {
	return gitCommitMessage(SHA)
		.then((message: string) => {
			clipboardy.write(message);

			return message;
		});
}

export function copySHAToClipboard(SHA: string): Promise<any> {
	return clipboardy.write(SHA);
}

export function openSingleCommitDiffFile(SHA: string): Promise<any> {
	return gitShow(SHA)
		.then((content: string) =>
			openTempFile(
				`temp-patch-${SHA}-at-${new Date().getTime()}.diff`,
				content));
}

export function openCommitRangeDiffFile(ancestorSHA: string, childSHA: string): Promise<any> {
	return gitDiff(ancestorSHA, childSHA)
		.then((content: string) =>
			openTempFile(
				`temp-patch-${ancestorSHA}-${childSHA}-at-${new Date().getTime()}.diff`,
				content));
}

export async function openFilesFromCommit(SHA: string): Promise<any> {
	const topLevel = await gitTopLevel();

	const filesString = await gitDiffNameOnly(SHA, SHA);

	const filesArray = filesString.split('\n')
		.map((file) => path.join(topLevel, file));

	return Promise.all(filesArray.map(opn));
}

function openTempFile(fileName: string, content: string): Promise<any> {
	const filePath = path.join(homedir(), fileName);

	return new Promise((resolve, reject) => {
		writeFile(filePath, content, {encoding: 'utf8'}, () => {
			opn(filePath, {wait: false})
				.then((opnProcess) => opnProcess.on('close', () => {
					unlinkSync(filePath);

					resolve(filePath);
				}))
				.catch((e) => {
					unlinkSync(filePath);

					reject(e);
				});
		});
	});
}
