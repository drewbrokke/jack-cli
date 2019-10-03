import { ChildProcess, spawn } from 'child_process';
import { Actions } from '../state/actions';
import { Screen, Status } from '../types/types';
import { logger } from './logger';
import { searchIndex } from './search';
import { GIT_LOG_ARGS, stash } from './stash';
import { getCounter } from './util-functions';

let gitLogProcess: ChildProcess;

export const generateLog = (screen: Screen) => {
	if (gitLogProcess) {
		gitLogProcess.stdout.removeAllListeners();
		gitLogProcess.stderr.removeAllListeners();
		gitLogProcess.removeAllListeners();

		gitLogProcess.kill();
	}

	searchIndex.clearIndex();

	Actions.clearLog();

	gitLogProcess = spawn('git', [
		'log',
		'--color=always',
		...stash.get(GIT_LOG_ARGS),
	]);

	let errorString = '';

	const counter = getCounter();

	gitLogProcess.stdout.setEncoding('utf8');
	gitLogProcess.stdout.on('data', (data: string) => {
		const lines = data.trim().split('\n');

		lines.forEach((line) => {
			searchIndex.indexLine(counter.next().value as number, line);
		});

		Actions.addCommits(lines);
	});

	gitLogProcess.stderr.on('data', (data: string) => (errorString += data));

	gitLogProcess.on('close', (code: number) => {
		if (code > 0) {
			screen.destroy();

			logger.error('\nGIT LOG ERROR:');
			logger.error(errorString);

			process.exit(code);
		} else {
			Actions.updateStatus(Status.LOG_COMPLETED);
		}
	});

	screen.render();
};
