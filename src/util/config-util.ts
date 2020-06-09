import * as fs from 'fs';
import { homedir } from 'os';
import { join } from 'path';

import { Command } from './commands-def';
import { logger } from './logger';
import { stringToCommandArray } from './util-functions';

interface Config {
	blacklistPatterns: string[];
	commands: Command[];
	gitShowOptions: string;
	notificationTimeout: number;
	searchIndexLimit: number;
	showLineNumbers: boolean;
	useLegacyEscapeKeyBehavior: boolean;
	useSearchIndex: boolean;
}

const DEFAULT_CONFIG: Config = {
	blacklistPatterns: [],
	commands: [],
	gitShowOptions: '--patch-with-stat --stat-width 1000 --color',
	notificationTimeout: 5000,
	searchIndexLimit: 300000,
	showLineNumbers: false,
	useLegacyEscapeKeyBehavior: false,
	useSearchIndex: true,
};

const _getConfigFilePath = (): string => {
	if (process.env.JACK_CLI_CONFIG_FILE_PATH) {
		if (!process.env.JACK_CLI_CONFIG_FILE_PATH.endsWith('.json')) {
			logger.warn(
				'The JACK_CLI_CONFIG_FILE_PATH environment variable must define a path to a *.json file. If this file does not exist, jack-cli will create it.',
			);

			process.exit(1);
		}

		return process.env.JACK_CLI_CONFIG_FILE_PATH;
	}

	return join(homedir(), '.jack.json');
};

const _readConfig = (configFilePath: string): Config => {
	if (!fs.existsSync(configFilePath)) {
		fs.writeFileSync(
			configFilePath,
			JSON.stringify(DEFAULT_CONFIG, null, 4),
		);

		return DEFAULT_CONFIG;
	}

	return { ...DEFAULT_CONFIG, ...require(configFilePath) };
};

const CONFIG_FILE_PATH: string = _getConfigFilePath();

const CONFIG: Config = _readConfig(CONFIG_FILE_PATH);

export const getBlacklistPatterns = (): RegExp[] =>
	CONFIG.blacklistPatterns.map(
		(blacklistPattern) => new RegExp(blacklistPattern),
	);
export const getCommands = (): Command[] => CONFIG.commands;
export const getConfigFilePath = () => CONFIG_FILE_PATH;
export const getGitShowOptions = (): string[] =>
	stringToCommandArray(CONFIG.gitShowOptions);
export const getNotificationTimeout = (): number => CONFIG.notificationTimeout;
export const getSearchIndexLimit = (): number => CONFIG.searchIndexLimit;
export const getShowLineNumbers = (): boolean => CONFIG.showLineNumbers;
export const getUseLegacyEscapeKeyBehavior = (): boolean =>
	CONFIG.useLegacyEscapeKeyBehavior;
export const getUseSearchIndex = (): boolean => CONFIG.useSearchIndex;
