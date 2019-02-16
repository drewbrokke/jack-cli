import * as fs from 'fs';
import { homedir } from 'os';
import { join } from 'path';

import { ICommand } from './commands-def';
import { stringToCommandArray } from './util-functions';

interface IConfig {
	blacklistPatterns?: string[];
	commands: ICommand[];
	gitShowOptions?: string;
	notificationTimeout?: number;
	showLineNumbers?: boolean;
}

const CONFIG_FILE_NAME = '.jack.json';
const CONFIG_FILE_PATH = join(homedir(), CONFIG_FILE_NAME);

const DEFAULT_GIT_SHOW_OPTIONS = '--patch-with-stat --stat-width 1000 --color';
const DEFAULT_NOTIFICATION_TIMEOUT = 5000;
const DEFAULT_SHOW_LINE_NUMBERS = false;

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

export const getShowLineNumbers = (): boolean => {
	return getConfig().showLineNumbers || DEFAULT_SHOW_LINE_NUMBERS;
};

export const getBlacklistPatterns = (): RegExp[] => {
	const blacklistPatterns = getConfig().blacklistPatterns || [];

	return blacklistPatterns.map(
		(blacklistPattern) => new RegExp(blacklistPattern),
	);
};

const getConfig = (): IConfig => {
	if (!config) {
		config = readConfig();
	}

	return config;
};

const readConfig = (): IConfig => {
	const defaultConfig: IConfig = {
		blacklistPatterns: [],
		commands: [],
		gitShowOptions: DEFAULT_GIT_SHOW_OPTIONS,
		notificationTimeout: DEFAULT_NOTIFICATION_TIMEOUT,
		showLineNumbers: DEFAULT_SHOW_LINE_NUMBERS,
	};

	if (!fs.existsSync(CONFIG_FILE_PATH)) {
		fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(defaultConfig));

		return defaultConfig;
	}

	return require(CONFIG_FILE_PATH);
};
