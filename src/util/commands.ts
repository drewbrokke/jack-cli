import { spawn } from 'child_process';
import * as clipboardy from 'clipboardy';
import * as opn from 'opn';
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
