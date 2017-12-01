import { unlinkSync } from 'fs';

import { getScreen } from './interface/screen';
import { generateLog } from './util/log-util';
import { GIT_LOG_ARGS, KEY_TEMP_FILES, stash } from './util/stash';

export const run = (args: string[]): void => {
	stash.set(GIT_LOG_ARGS, args);

	generateLog(getScreen());

	process.on('exit', () => {
		if (stash.has(KEY_TEMP_FILES)) {
			const tempFilesArray: string[] = stash.get(KEY_TEMP_FILES);

			tempFilesArray.forEach((file) => unlinkSync(file));
		}
	});
};

export const runFromPipedData = (): void => {
	process.stderr.write('Piping into jack is not currently supported.\n');
	process.stderr.write(
		'If you would like to contribute or comment, please see the issue on ' +
		'GitHub at https://github.com/drewbrokke/jack/issues/9.\n');

	process.exit(1);
};
