import {
	notifyError,
	notifyInfo,
	notifySuccess,
} from '../interface/notification';
import { markSHA } from '../redux/action-creators';
import { store } from '../redux/store';
import { IScreen } from '../types/types';
import {
	COMMANDS,
	ICommand,
	Placeholder,
	validateCommand,
} from './commands-def';
import { readConfig } from './config-util';
import { gitCommitMessage, sortSHAs } from './git-util';
import { generateLog } from './log-util';
import { spawnPromise } from './promisify-child-process';
import { uniqByLast } from './uniq-by';

let declaredCommands: ICommand[];

export const getCommands = () => {
	if (declaredCommands) return declaredCommands;

	declaredCommands = [...COMMANDS, ...(readConfig().commands)];

	declaredCommands.forEach(validateCommand);

	declaredCommands = uniqByLast(
		[...COMMANDS, ...(readConfig().commands)], 'key');

	return declaredCommands;
};

export const registerCommands =
	(screen: IScreen, commands: ICommand[] = []): IScreen => {
		commands.forEach(
			(command) => screen.key(
				command.key,
				async () => registerCommand(screen, command)));

		return screen;
	};

// tslint:disable-next-line:max-line-length
const registerCommand = async (screen: IScreen, command: ICommand): Promise<any> => {
	const { markedSHA, SHA } = store.getState();

	try {
		const sorted = markedSHA ? await sortSHAs(markedSHA, SHA) : [SHA, SHA];

		const commandArray = command.commandArray
			.map(replacer(Placeholder.SHA_SINGLE, SHA))
			.map(replacer(Placeholder.SHA_RANGE, `${sorted[0]}^..${sorted[1]}`))
			.map(replacer(
				Placeholder.SHA_SINGLE_OR_RANGE,
				markedSHA ? `${sorted[0]}^..${sorted[1]}` : SHA))
			.map(replacer(Placeholder.COMMIT_MESSAGE, await gitCommitMessage(SHA)));

		const spawnOpts = { shell: commandArray.includes('|') };

		const commandString = commandArray.join(' ');
		const messages: string[] = [];

		if (command.description) {
			messages.push(command.description);
		}

		messages.push(`Running command "${commandString}"`);

		notifyInfo(messages.join('\n'));

		if (command.foreground) {
			await new Promise((resolve, reject) => {
				screen.exec(
					// @ts-ignore since 'spawnOpts' is passed to spawn and not
					// exec, it will still function
					commandArray[0], commandArray.slice(1), spawnOpts, (err, ok) => {
						if (err) {
							reject(err.message);
						} else if (!ok) {
							reject('The command exited with a error code.');
						} else {
							resolve();
						}
					});
			});
		} else {
			await spawnPromise(commandArray[0], commandArray.slice(1), spawnOpts);
		}

		if (command.refreshOnComplete) {
			generateLog(screen);
		}

		notifySuccess(`Command finished: "${commandString}"`);
	} catch (errorMessage) {
		notifyError(errorMessage);

		const { onErrorCommand } = command;

		if (onErrorCommand) {
			notifyInfo(`Performing clean-up command "${onErrorCommand.join(' ')}"`);

			try {
				await spawnPromise(onErrorCommand[0], onErrorCommand.slice(1));
			} catch (cleanUpCommandErrorMessage) {
				notifyError(cleanUpCommandErrorMessage);
			}
		}
	}

	if (markedSHA) {
		store.dispatch(markSHA(null));

		notifyInfo('Unmarked commit');
	}
};

const replacer =
	(s: string, r: string) => (i: string): string => i.replace(s, r);
