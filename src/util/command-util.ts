import {
	notifyError,
	notifyInfo,
	notifyWarning,
} from '../interface/notification';
import { markSHA } from '../redux/action-creators';
import { store } from '../redux/store';
import { IScreen } from '../types/types';
import { ICommand, ModifierKey, SHA_PLACEHOLDER } from './commands-def';
import { sortSHAs } from './git-util';
import { spawnPromise } from './promisify-child-process';

export const registerCommands =
	(screen: IScreen, commands: ICommand[]): IScreen => {
		commands.forEach((command) => {
			screen.key(
				getKeyEventString(command),
				async () => {
					const { markedSHA, SHA } = store.getState();

					try {
						let commandArray;

						if (markedSHA && command.acceptsRange) {
							const [ancestorSHA, childSHA] =
								await sortSHAs(markedSHA, SHA);

							commandArray = command.commandArray.map(
								(item) => item.replace(
									SHA_PLACEHOLDER, `${ancestorSHA}^..${childSHA}`));
						} else {
							if (command.forceRange) {
								commandArray = command.commandArray.map(
									(item) => item.replace(SHA_PLACEHOLDER, `${SHA}^..${SHA}`));
							} else {
								commandArray = command.commandArray.map(
									(item) => item.replace(SHA_PLACEHOLDER, `${SHA}`));
							}
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
				});
		});

		return screen;
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
