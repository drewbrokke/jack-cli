import {
	notifyError,
	notifyInfo,
	notifyWarning,
} from '../interface/notification';
import { markSHA } from '../redux/action-creators';
import { store } from '../redux/store';
import { IScreen } from '../types/types';
import {
	COMMANDS,
	COMMIT_MESSAGE_PLACEHOLDER,
	ICommand,
	ModifierKey,
	SHA_PLACEHOLDER,
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
		let commandArray;

		const commitMessage = await gitCommitMessage(SHA);

		if (markedSHA && command.acceptsRange) {
			const [ancestorSHA, childSHA] =
				await sortSHAs(markedSHA, SHA);

			commandArray = command.commandArray.map(
				(item) => item.replace(SHA_PLACEHOLDER, `${ancestorSHA}^..${childSHA}`)
					.replace(COMMIT_MESSAGE_PLACEHOLDER, commitMessage));
		} else if (command.forceRange) {
			commandArray = command.commandArray.map(
				(item) => item.replace(SHA_PLACEHOLDER, `${SHA}^..${SHA}`)
					.replace(COMMIT_MESSAGE_PLACEHOLDER, commitMessage));
		} else {
			commandArray = command.commandArray.map(
				(item) => item.replace(SHA_PLACEHOLDER, `${SHA}`)
					.replace(COMMIT_MESSAGE_PLACEHOLDER, commitMessage));
		}

		notifyWarning(`Running command "${commandArray.join(' ')}"`);

		if (command.foreground) {
			screen.spawn(commandArray[0], commandArray.slice(1), {});
		} else {
			await spawnPromise(commandArray[0], commandArray.slice(1));
		}

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
		acceptsRange: true,
		forceRange: false,
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
	const { key } = command;

	switch (command.modifierKey) {
		case ModifierKey.CONTROL:
			return `C-${key}`;

		case ModifierKey.SHIFT:
			return `S-${key}`;

		default:
			return key;
	}
};
