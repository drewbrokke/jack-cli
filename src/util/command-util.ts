import {
	notifyError,
	notifyInfo,
	notifySuccess,
} from '../interface/notification';
import { markSHA } from '../state/action-creators';
import { store } from '../state/store';
import { Screen } from '../types/types';
import { COMMANDS, ICommand, Placeholder } from './commands-def';
import { getCommands as getConfigurationCommands } from './config-util';
import { gitCommitMessage, sortSHAs } from './git-util';
import { generateLog } from './log-util';
import { spawnPromise } from './promisify-child-process';
import { stringToCommandArray } from './util-functions';
import { uniqByLast } from './util-functions';
import { validate } from './validators';

let declaredCommands: ICommand[];

const buildErrorMessage = (
	command: ICommand,
	errorMessages: string[],
): string => `----------

${errorMessages.map((s) => `ERROR: ${s}`).join('\n')}

Command object:

${JSON.stringify(command, null, '    ')}

`;

export const getCommands = () => {
	if (declaredCommands) return declaredCommands;

	declaredCommands = [...COMMANDS, ...getConfigurationCommands()];

	const errorMessages: string[] = [];

	for (const command of declaredCommands) {
		const errors = validate(command);

		if (errors.length) {
			errorMessages.push(buildErrorMessage(command, errors));
		}
	}

	if (errorMessages.length > 0) {
		process.stderr.write(
			`
One or more errors while registering commands from your .jack.json file:

${errorMessages.join('\n')}`,
		);

		process.exit(1);
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

		let commandString = command.command;

		commandString = commandString.replace(Placeholder.SHA_SINGLE, SHA);
		commandString = commandString.replace(
			Placeholder.SHA_RANGE,
			`${sorted[0]}^..${sorted[1]}`,
		);
		commandString = commandString.replace(
			Placeholder.SHA_SINGLE_OR_RANGE,
			markedSHA ? `${sorted[0]}^..${sorted[1]}` : SHA,
		);
		commandString = commandString.replace(
			Placeholder.COMMIT_MESSAGE,
			await gitCommitMessage(SHA),
		);

		const invalidTokenIndex = commandString.search(/\[% [^\%]+ %\]/g);

		if (invalidTokenIndex !== -1) {
			const invalidTokenString = commandString.slice(
				invalidTokenIndex,
				commandString.indexOf('%]', invalidTokenIndex) + 2,
			);

			await Promise.reject(
				`Invalid token found: ${invalidTokenString}

Use ${invalidTokenString.replace(/ /g, '')} instead.

For command: ${commandString}`,
			);
		}

		const commandArray = stringToCommandArray(commandString);

		const spawnOpts = { shell: commandArray.includes('|') };

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
					(err: Error, ok: boolean) => {
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
