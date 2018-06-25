import * as fs from 'fs';
import * as osHomedir from 'os-homedir';
import { join } from 'path';

import { stringToCommandArray } from './command-string-util';
import { ICommand } from './commands-def';

interface IConfig {
	commands: ICommand[];
	gitShowOptions?: string;
	notificationTimeout?: number;
}

const CONFIG_FILE_NAME = '.jack.json';
const CONFIG_FILE_PATH = join(osHomedir(), CONFIG_FILE_NAME);

const DEFAULT_GIT_SHOW_OPTIONS = '--patch-with-stat --stat-width 1000 --color';
const DEFAULT_NOTIFICATION_TIMEOUT = 5000;

let config: IConfig;

export const getCommands = (): ICommand[] => {
	return getConfig().commands || [];
};

export const getGitShowOptions = (): string[] => {
	const gitShowOptionsString =
		getConfig().gitShowOptions || DEFAULT_GIT_SHOW_OPTIONS;

	return stringToCommandArray(gitShowOptionsString);
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
		commands: [],
		gitShowOptions: DEFAULT_GIT_SHOW_OPTIONS,
		notificationTimeout: DEFAULT_NOTIFICATION_TIMEOUT,
	};

	if (!fs.existsSync(CONFIG_FILE_PATH)) {
		fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(defaultConfig));

		return defaultConfig;
	}

	return require(CONFIG_FILE_PATH);
};
