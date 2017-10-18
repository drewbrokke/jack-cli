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
	COMMIT_MESSAGE_PLACEHOLDER,
	ICommand,
	ModifierKey,
	SHA_RANGE_PLACEHOLDER,
	SHA_SINGLE_OR_RANGE_PLACEHOLDER,
	SHA_SINGLE_PLACEHOLDER,
} from './commands-def';
import { readConfig } from './config-util';
import { gitCommitMessage, sortSHAs } from './git-util';
import { spawnPromise } from './promisify-child-process';

let declaredCommands: ICommand[];

export const getCommands = () => {
	if (declaredCommands) return declaredCommands;

	declaredCommands = [
		...COMMANDS,
		...(readConfig().commands),
	];

	return declaredCommands;
};

export const documentCommands = (commands: ICommand[]) => {
	return commands.map((command) => {
		const description = command.description
			? command.description
			: `Run "${command.commandArray.join(' ')}"`;

		const keyEventString = command.modifierKey
			? command.modifierKey + '-' + command.key
			: command.key;

		return `${description}  ->  ${keyEventString}`;
	}).join('\n');
};

export const registerCommands =
	(screen: IScreen, commands: ICommand[] = []): IScreen => {
		commands.forEach((c) => {
			const command = constructCommand(c);

			screen.key(
				getKeyEventString(command),
				async () => registerCommand(screen, command));
		});

		return screen;
	};

// tslint:disable-next-line:max-line-length
const registerCommand = async (screen: IScreen, command: ICommand): Promise<any> => {
	const { markedSHA, SHA } = store.getState();

	try {
		const sorted = markedSHA ? await sortSHAs(markedSHA, SHA) : [SHA, SHA];

		const commandArray = command.commandArray
			.map(replacer(SHA_SINGLE_PLACEHOLDER, SHA))
			.map(replacer(SHA_RANGE_PLACEHOLDER, `${sorted[0]}^..${sorted[1]}`))
			.map(replacer(
				SHA_SINGLE_OR_RANGE_PLACEHOLDER,
				markedSHA ? `${sorted[0]}^..${sorted[1]}` : SHA))
			.map(replacer(COMMIT_MESSAGE_PLACEHOLDER, await gitCommitMessage(SHA)));

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
					commandArray[0], commandArray.slice(1), {}, (err, ok) => {
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
			await spawnPromise(commandArray[0], commandArray.slice(1));
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

// tslint:disable-next-line:only-arrow-functions
function constructCommand(command: ICommand): ICommand {
	const { commandArray } = command;

	if (!commandArray || !Array.isArray(commandArray) ||
		commandArray.length === 0) {

		crashCommandRegistrationError(
			'There must be an array to declare a command and its arguments.\n\n',
			command);
	}

	const { key } = command;

	if (!key || typeof key !== 'string') {
		crashCommandRegistrationError(
			'There must be a "key" property given to trigger the command:', command);
	}

	return {
		foreground: false,
		...command,
	};
}

const crashCommandRegistrationError =
	(errorMessage: string, command?: ICommand) => {
		process.stderr.write(
			'There was a problem registering a custom command from your ' +
			'.jack.json config file:\n\n');
		process.stderr.write(errorMessage + '\n\n');

		if (command) {
			process.stderr.write(JSON.stringify(command, null, '    ') + '\n');
		}

		process.exit(1);
	};

const getKeyEventString = (command: ICommand): string => {
	const key = command.key.toLowerCase();

	switch (command.modifierKey) {
		case ModifierKey.CONTROL:
			return `C-${key}`;

		case ModifierKey.SHIFT:
			return `S-${key}`;

		default:
			return key;
	}
};

const replacer =
	(s: string, r: string) => (i: string): string => i.replace(s, r);
