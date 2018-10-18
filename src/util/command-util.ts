import {
	notifyError,
	notifyInfo,
	notifySuccess,
} from '../interface/notification';
import { markSHA } from '../redux/action-creators';
import { store } from '../redux/store';
import { Screen } from '../types/types';
import { COMMANDS, ICommand, Placeholder } from './commands-def';
import { getCommands as getConfigurationCommands } from './config-util';
import { gitCommitMessage, sortSHAs } from './git-util';
import { generateLog } from './log-util';
import { spawnPromise } from './promisify-child-process';
import { stringToCommandArray } from './util-functions';
import { uniqByLast } from './util-functions';

let declaredCommands: ICommand[];

const KEY_REGEX = /^([CS]-)?[a-z]$/;
const RESERVED_KEYS = [...'bfgjkmoqrxy?'.split(''), 'C-c', 'S-j', 'S-k'];

class ValidatorError extends Error {
	public commandOptions: ICommand;

	constructor(message: string, commandOptions: ICommand) {
		super(message);

		this.commandOptions = commandOptions;
	}
}

const crash = (validatorError: ValidatorError) => {
	process.stderr.write(
		'There was a problem registering a custom command from your ' +
			'.jack.json config file:\n\n',
	);
	process.stderr.write(validatorError.message + '\n\n');

	if (validatorError.commandOptions) {
		process.stderr.write('Fix this command object:\n');
		process.stderr.write(
			JSON.stringify(validatorError.commandOptions, null, '    ') + '\n',
		);
	}

	process.exit(1);
};

const validateCommand = (commandOptions: ICommand): void => {
	if (!commandOptions.command) {
		throw new ValidatorError(
			'Command object is missing the required property "command".',
			commandOptions,
		);
	}

	if (typeof commandOptions.command !== 'string') {
		throw new ValidatorError(
			'The property "command" must be a string.',
			commandOptions,
		);
	}

	if (!commandOptions.description) {
		throw new ValidatorError(
			'Command object is missing the required property "description".',
			commandOptions,
		);
	}

	if (typeof commandOptions.description !== 'string') {
		throw new ValidatorError(
			'The property "description" must be a string.',
			commandOptions,
		);
	}

	const { key } = commandOptions;

	if (!key) {
		throw new ValidatorError(
			'Command object is missing the required property "key".',
			commandOptions,
		);
	}

	if (typeof key !== 'string') {
		throw new ValidatorError(
			'The property "key" must be a string.',
			commandOptions,
		);
	}

	if (!KEY_REGEX.test(key)) {
		throw new ValidatorError(
			`The property "key" must match against the regex "${KEY_REGEX}"`,
			commandOptions,
		);
	}

	if (RESERVED_KEYS.includes(key)) {
		throw new ValidatorError(
			// tslint:disable-next-line:max-line-length
			`The key combination "${key}" is reserved. Here is the list of reserved key combinations: ${RESERVED_KEYS.join(
				' ',
			)}`,
			commandOptions,
		);
	}

	if (
		commandOptions.foreground &&
		typeof commandOptions.foreground !== 'boolean'
	) {
		throw new ValidatorError(
			'The property "foreground" must be a boolean.',
			commandOptions,
		);
	}

	if (
		commandOptions.onErrorCommand &&
		typeof commandOptions.onErrorCommand !== 'string'
	) {
		throw new ValidatorError(
			'The property "onErrorCommand" must be a string',
			commandOptions,
		);
	}

	if (
		commandOptions.refreshOnComplete &&
		typeof commandOptions.refreshOnComplete !== 'boolean'
	) {
		throw new ValidatorError(
			'The property "refreshOnComplete" must be a boolean.',
			commandOptions,
		);
	}
};

export const getCommands = () => {
	if (declaredCommands) return declaredCommands;

	declaredCommands = [...COMMANDS, ...getConfigurationCommands()];

	try {
		declaredCommands.forEach(validateCommand);
	} catch (error) {
		crash(error);
	}

	declaredCommands = uniqByLast(declaredCommands, 'key');

	return declaredCommands;
};

// tslint:disable-next-line:max-line-length
export const registerCommand = async (
	screen: Screen,
	command: ICommand,
): Promise<any> => {
	const { markedSHA, SHA } = store.getState();

	try {
		const sorted = markedSHA ? await sortSHAs(markedSHA, SHA) : [SHA, SHA];

		const commandArray = stringToCommandArray(command.command)
			.map(replacer(Placeholder.SHA_SINGLE, SHA))
			.map(replacer(Placeholder.SHA_RANGE, `${sorted[0]}^..${sorted[1]}`))
			.map(
				replacer(
					Placeholder.SHA_SINGLE_OR_RANGE,
					markedSHA ? `${sorted[0]}^..${sorted[1]}` : SHA,
				),
			)
			.map(
				replacer(
					Placeholder.COMMIT_MESSAGE,
					await gitCommitMessage(SHA),
				),
			);

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
					commandArray[0],
					commandArray.slice(1),
					// @ts-ignore since 'spawnOpts' is passed to spawn and not
					// exec, it will still function
					spawnOpts,
					(err, ok) => {
						if (err) {
							reject(err.message);
						} else if (!ok) {
							reject('The command exited with a error code.');
						} else {
							resolve();
						}
					},
				);
			});
		} else {
			await spawnPromise(
				commandArray[0],
				commandArray.slice(1),
				spawnOpts,
			);
		}

		if (command.refreshOnComplete) {
			generateLog(screen);
		}

		notifySuccess(`Command finished: "${commandString}"`);
	} catch (errorMessage) {
		notifyError(errorMessage);

		const { onErrorCommand } = command;

		if (onErrorCommand) {
			notifyInfo(`Performing clean-up command "${onErrorCommand}"`);

			try {
				const onErrorCommandArray = stringToCommandArray(
					onErrorCommand,
				);

				await spawnPromise(
					onErrorCommandArray[0],
					onErrorCommandArray.slice(1),
				);
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

const replacer = (s: string, r: string) => (i: string): string =>
	i.replace(s, r);
