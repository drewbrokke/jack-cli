import { getScreen } from './interface/screen';
import { generateLog } from './util/log-util';
import { GIT_LOG_ARGS, stash } from './util/stash';

export const run = (args: string[]): void => {
	stash.set(GIT_LOG_ARGS, args);

	generateLog(getScreen());
};

export const runFromPipedData = (): void => {
	process.stderr.write('Piping into jack is not currently supported.\n');
	process.stderr.write(
		'If you would like to contribute or comment, please see the issue on ' +
			'GitHub at https://github.com/drewbrokke/jack/issues/9.\n',
	);

	process.exit(1);
};
