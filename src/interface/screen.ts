import { exec, spawnSync } from 'child_process';
import * as clipboardy from 'clipboardy';
import * as opn from 'opn';
import * as path from 'path';

import { notificationRequested } from '../redux/action-creators';
import { store } from '../redux/store';
import { Screen } from '../types/types';
import { getScreenElement } from './interface-elements';

const REPO_TOP_LEVEL: string = spawnSync('git', ['rev-parse', '--show-toplevel']).stdout.toString().split('\n')[0];

export function getScreen(): Screen {
	const screen: Screen = getScreenElement({
		smartCSR: true,
	});

	screen.key('c', copySHAToClipboard);
	screen.key('o', openFilesFromCommit);
	screen.key(['C-c', 'q', 'escape'], () => process.exit(0));

	return screen;
}

function copySHAToClipboard(): void {
	const {SHA} = store.getState();

	clipboardy.writeSync(SHA);

	store.dispatch(notificationRequested(`Copied SHA to the clipboard: ${SHA}`));
}

function openFilesFromCommit(): void {
	const {SHA} = store.getState();

	exec(`git diff --name-only ${SHA}^..${SHA}`, (_error: Error, stdout: string) => {
		const files: string[] = stdout.split('\n').filter(Boolean);

		files
			.map((file: string) => path.join(REPO_TOP_LEVEL, file))
			.forEach((file: string) => opn(file));

		store.dispatch(notificationRequested(`Opening files:\n\n${files.join('\n')}`));
	});
}
