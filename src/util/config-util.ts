import * as fs from 'fs';
import { homedir } from 'os';
import { join } from 'path';

import { ICommand } from './commands-def';

interface IConfig {
	commands: ICommand[];
}

const CONFIG_FILE_NAME = '.jack.json';
const CONFIG_FILE_PATH = join(homedir(), CONFIG_FILE_NAME);

export const readConfig = (): IConfig => {
	const defaultConfig: IConfig = { commands: [] };

	if (!fs.existsSync(CONFIG_FILE_PATH)) {
		fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(defaultConfig));

		return defaultConfig;
	}

	return JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, { encoding: 'utf8' }));
};
