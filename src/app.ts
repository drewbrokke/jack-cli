import { ChildProcess, spawn } from 'child_process';

import { getScreen } from './interface/screen';
import { addCommits } from './redux/action-creators';
import { store } from './redux/store';

export function run(args: string[]): void {
	getScreen().render();

	const gitLogProcess: ChildProcess = spawn(
		'git',
		[
			'log',
			'--color=always',
			...args,
		],
	);

	gitLogProcess.stdout.setEncoding('utf8');
	gitLogProcess.stdout.on('data', (data: string) => {
		store.dispatch(addCommits(data.trim().split('\n')));
	});
}

export function runFromPipedData(): void {
	console.log('From Piped');
}
