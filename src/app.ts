import { getScreen } from './interface/screen';
import { getCommands } from './util/command-util';
import { generateLog } from './util/log-util';
import { logger } from './util/logger';
import { GIT_LOG_ARGS, stash } from './util/stash';

export const run = (args: string[]): void => {
	stash.set(GIT_LOG_ARGS, args);

	generateLog(getScreen(getCommands()));
};

export const runFromPipedData = (): void => {
	logger.warn('Piping into jack is not currently supported.');
	logger.warn(
		'If you would like to contribute or comment, please see the issue on ' +
			'GitHub at https://github.com/drewbrokke/jack/issues/9.',
	);

	process.exit(1);
};
