import * as fs from 'fs';
import * as osHomedir from 'os-homedir';
import { join } from 'path';

import { ICommand } from './commands-def';

interface IConfig {
	commands: ICommand[];
	notificationTimeout?: number;
}

const CONFIG_FILE_NAME = '.jack.json';
const CONFIG_FILE_PATH = join(osHomedir(), CONFIG_FILE_NAME);

const DEFAULT_NOTIFICATION_TIMEOUT = 5000;

let config: IConfig;

export const getCommands = (): ICommand[] => {
	return getConfig().commands || [];
};

export const getNotificationTimeout = (): number => {
	return getConfig().notificationTimeout || DEFAULT_NOTIFICATION_TIMEOUT;
};

const getConfig = (): IConfig => {
	if (!config) {
		config = readConfig();
	}

	return config;
};

const readConfig = (): IConfig => {
	const defaultConfig: IConfig = {
		commands: [], notificationTimeout: DEFAULT_NOTIFICATION_TIMEOUT,
	};

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
