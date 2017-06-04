import { ChildProcess } from 'child_process';

import { getScreen } from './interface/screen';
import { addCommits } from './redux/action-creators';
import { store } from './redux/store';

import { getGitLogProcess } from './util/git-util';

export function run(args: string[]): void {
	getScreen().render();

	const gitLogProcess: ChildProcess = getGitLogProcess(args);

	gitLogProcess.stdout.setEncoding('utf8');
	gitLogProcess.stdout.on('data', (data: string) => {
		store.dispatch(addCommits(data.trim().split('\n')));
	});
}
