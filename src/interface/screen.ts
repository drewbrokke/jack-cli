import { ChildProcess, exec, spawn, spawnSync, SpawnSyncReturns } from 'child_process';
import * as clipboardy from 'clipboardy';
import * as opn from 'opn';
import * as path from 'path';

import { notificationRequested } from '../redux/action-creators';
import { store } from '../redux/store';
import {
	Screen,
} from '../types/types';
import { getScreenElement } from './interface-elements';
import { toggleHelp } from './notification';

const REPO_TOP_LEVEL: string = spawnSync('git', ['rev-parse', '--show-toplevel']).stdout.toString().split('\n')[0];

export function getScreen(): Screen {
	const screen: Screen = getScreenElement({
		autoPadding: true,
		smartCSR: true,
	});

	screen.key('?', toggleHelp);
	screen.key('c', cherryPickCommit);
	screen.key('o', openFilesFromCommit);
	screen.key('y', copySHAToClipboard);
	screen.key(['C-c', 'q', 'escape'], () => process.exit(0));

	return screen;
}

function cherryPickCommit(): void {
	const {SHA} = store.getState();

	const cherryPickSync: SpawnSyncReturns<string> = spawnSync('git', ['cherry-pick', SHA]);

	if (cherryPickSync.status !== 0) {
		store.dispatch(
			notificationRequested(
				`Cherry-pick failed:\n\n${cherryPickSync.stderr.toString()}\n\nAborting cherry-pick.`, 'ERROR'));

		spawn('git', ['cherry-pick', '--abort']);
	} else {
		store.dispatch(
			notificationRequested(
				`Successfully cherry-picked commit ${SHA} onto current branch.`, 'SUCCESS'));
	}
}

function copySHAToClipboard(): void {
	const {SHA} = store.getState();

	clipboardy.writeSync(SHA);

	store.dispatch(notificationRequested(`Copied SHA to the clipboard: ${SHA}`, 'SUCCESS'));
}

function openFilesFromCommit(): void {
	const {SHA} = store.getState();

	exec(`git diff --name-only ${SHA}^..${SHA}`, (_error: Error, stdout: string) => {
		const files: string[] = stdout.split('\n').filter(Boolean);

		if (process.platform === 'darwin') {
			const openProcess: ChildProcess = spawn('open', files, { cwd: REPO_TOP_LEVEL });

			openProcess.on('error', (err: Error) => {
				store.dispatch(notificationRequested(err.message, 'ERROR'));
			});

			openProcess.on('close', (code: number) => {
				if (code === 0) {
					store.dispatch(
						notificationRequested(
							`Successfully opened files:\n\n${files.join('\n')}`, 'SUCCESS'));
				}
			});
		} else {
			files.map((file: string) => path.join(REPO_TOP_LEVEL, file)).forEach(opn);
		}

		store.dispatch(
			notificationRequested(
				`Opening files:\n\n${files.join('\n')}`, 'INFO'));
	});
}
