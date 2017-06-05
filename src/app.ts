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
	process.stdout.write('Piping into jack is not currently supported.\n');
	process.stdout.write('If you would like to contribute or comment, please see the issue on GitHub at https://github.com/drewbrokke/jack/issues/9.\n');

	process.exit(1);
}
