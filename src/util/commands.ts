import { ChildProcess, spawn } from 'child_process';
import * as clipboardy from 'clipboardy';
import { createWriteStream, unlinkSync } from 'fs';
import * as opn from 'opn';
import { homedir } from 'os';
import * as path from 'path';

import { notifyError, notifyInfo, notifySuccess } from '../interface/notification';
import { promisifyChildProcess } from './promisify-child-process';

let REPO_TOP_LEVEL: string;

export function cherryPickCommit(SHA: string): void {
	promisifyChildProcess(spawn('git', ['cherry-pick', SHA]))
		.then(() => notifySuccess(`Successfully cherry-picked commit ${SHA} onto current branch.`))
		.catch((errorMessage: string) => {
			notifyError(`Cherry-pick failed:\n\n${errorMessage}\n\nAborting cherry-pick.`);
			spawn('git', ['cherry-pick', '--abort']);
		});
}

export function copyCommitMessageToClipboard(SHA: string): void {
	promisifyChildProcess(spawn('git', ['show', SHA, '-s', '--pretty=format:%s']))
		.then((message: string) => {
			clipboardy.write(message)
				.then(notifySuccess(`Copied commit message to the clipoard:\n"${message}"`));
		});
}

export function copySHAToClipboard(SHA: string): void {
	clipboardy.write(SHA)
		.then(() => notifySuccess(`Copied SHA to the clipboard: ${SHA}`));
}

export function openSingleCommitDiffFile(SHA: string): void {
	createAndOpenProcessOutputFile(
		`temp-patch-${SHA}-at-${new Date().getTime()}.diff`,
		spawn('git', [ 'show', '--patch-with-stat', SHA ], {}));
}

export function openCommitRangeDiffFile(ancestorSHA: string, childSHA: string) {
	createAndOpenProcessOutputFile(
		`temp-patch-${ancestorSHA}-${childSHA}-at-${new Date().getTime()}.diff`,
		spawn('git', ['diff', `${ancestorSHA}^..${childSHA}`], {}));
}

export function getParentChildObject(ancestorSHA: string, childSHA: string) {
	return new Promise((resolve) => {
		const gitMergeBaseProcess = spawn('git', ['merge-base', '--is-ancestor', ancestorSHA, childSHA]);

		gitMergeBaseProcess.on('close', (code: number) => {
			if (code === 0) {
				resolve({
					ancestor: ancestorSHA,
					child: childSHA,
				});
			} else {
				resolve({
					ancestor: childSHA,
					child: ancestorSHA,
				});
			}
		});
	});
}

export function openFilesFromCommit(SHA: string): void {
	if (REPO_TOP_LEVEL) {
		doOpenFilesFromCommit(SHA, REPO_TOP_LEVEL);
	} else {
		promisifyChildProcess(spawn('git', ['rev-parse', '--show-toplevel']))
			.then((repoTopLevel: string) => {
				REPO_TOP_LEVEL = repoTopLevel;

				doOpenFilesFromCommit(SHA, repoTopLevel);
			})
			.catch(handleOpenFilesFromCommitError);
	}
}

// Helper functions

function doOpenFilesFromCommit(SHA: string, repoTopLevel: string): void {
	promisifyChildProcess(spawn('git', ['diff', '--name-only', `${SHA}^..${SHA}`]))
		.then((filesString: string) => {
			const files: string[] = filesString.split('\n');

			files.map((file: string) => path.join(repoTopLevel, file)).forEach(opn);

			notifyInfo(`Opening files:\n\n${filesString}`);
		})
		.catch(handleOpenFilesFromCommitError);
}

function handleOpenFilesFromCommitError(errorMessage: string) {
	notifyError(`Could not open files:\n\n${errorMessage}`);
}

function createAndOpenProcessOutputFile(fileName: string, gitProcess: ChildProcess): void {
	const filePath = path.join(homedir(), fileName);

	const fileStream = createWriteStream(filePath);

	gitProcess.stdout.pipe(fileStream);

	gitProcess.on('close', () => {
		fileStream.end();

		opn(filePath, {wait: false})
			.then((opnProcess) => opnProcess.on('close', () => unlinkSync(filePath)))
			.catch((e) => {
				unlinkSync(filePath);

				notifyError(e);
			});
	});
}
