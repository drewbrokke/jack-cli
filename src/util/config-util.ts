import * as fs from 'fs';
import { homedir } from 'os';
import { join } from 'path';

import { ICommand } from './commands-def';

interface IConfig {
	commands: ICommand[];
	notificationTimeout?: number;
}

const CONFIG_FILE_NAME = '.jack.json';
const CONFIG_FILE_PATH = join(homedir(), CONFIG_FILE_NAME);

export const readConfig = (): IConfig => {
	const defaultConfig: IConfig = { commands: [], notificationTimeout: 5000 };

	if (!fs.existsSync(CONFIG_FILE_PATH)) {
		fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(defaultConfig));

		return defaultConfig;
	}

	try {
		return JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, { encoding: 'utf8' }));
	} catch (error) {
		process.stderr.write('There was an issue reading your config file:\n\n');
		process.stderr.write(error.message + '\n');

		process.exit(1);

		return defaultConfig;
	}
};
