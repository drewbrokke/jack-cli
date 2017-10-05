import {
	notifyError,
	notifyInfo,
	notifyWarning,
} from '../interface/notification';
import { markSHA } from '../redux/action-creators';
import { store } from '../redux/store';
import { IScreen } from '../types/types';
import { sortSHAs } from './git-util';
import { spawnPromise } from './promisify-child-process';

enum ModifierKey {
	CONTROL = 'CONTROL',
	NONE = 'NONE',
	SHIFT = 'SHIFT',
}

interface ICommand {
	acceptsRange: boolean;
	commandArray: string[];
	foreground: boolean;
	key: string;
	modifierKey: ModifierKey;
}

const SHA_PLACEHOLDER = '<%-- SHA --%>';

const commands: ICommand[] = [
	/**
	 * Open a diff
	 */
	{
		acceptsRange: true,
		commandArray: [
			'git',
			'diff',
			SHA_PLACEHOLDER,
			'--patch',
			'--stat-width=1000',
		],
		foreground: true,
		key: 'd',
		modifierKey: ModifierKey.NONE,
	},

	/**
	 * List changed files
	 */
	{
		acceptsRange: true,
		commandArray: ['git', 'diff', SHA_PLACEHOLDER, '--name-only'],
		foreground: true,
		key: 'n',
		modifierKey: ModifierKey.NONE,
	},

	/**
	 * Open changes in a difftool
	 */
	{
		acceptsRange: true,
		commandArray: ['git', 'difftool', SHA_PLACEHOLDER],
		foreground: false,
		key: 't',
		modifierKey: ModifierKey.NONE,
	},

	/**
	 * Attempt a cherry-pick
	 */
	{
		acceptsRange: true,
		commandArray: ['git', 'cherry-pick', SHA_PLACEHOLDER],
		foreground: false,
		key: 'c',
		modifierKey: ModifierKey.SHIFT,
	},

	/**
	 * Begin an interactive rebase
	 */
	{
		acceptsRange: false,
		commandArray: ['git', 'rebase', '-i', SHA_PLACEHOLDER + '^'],
		foreground: true,
		key: 'i',
		modifierKey: ModifierKey.SHIFT,
	},
];

export const registerCommands = (screen: IScreen): IScreen => {
	commands.forEach((command) => registerCommand(screen, command));

	return screen;
};

const getMarkedSHA = () => store.getState().markedSHA;
const getSHA = () => store.getState().SHA;

const unmarkAnchorCommit = () => {
	store.dispatch(markSHA(null));

	notifyInfo('Unmarked commit');
};

const getKeyEventString = (key: string, modifierKey: ModifierKey): string => {
	switch (modifierKey) {
		case ModifierKey.CONTROL:
			return `C-${key}`;

		case ModifierKey.SHIFT:
			return `S-${key}`;

		case ModifierKey.NONE:
			return key;
	}
};

const registerCommand = (screen: IScreen, command: ICommand): IScreen => {
	const keyEventString = getKeyEventString(
		command.key, command.modifierKey);

	screen.key(keyEventString, async () => {
		const markedSHA = getMarkedSHA();

		try {
			const SHA = getSHA();

			let commandArray;

			if (markedSHA && command.acceptsRange) {
				const [ancestorSHA, childSHA] =
					await sortSHAs(markedSHA, SHA);

				commandArray = command.commandArray.map(
					(item) => item.replace(SHA_PLACEHOLDER, `${ancestorSHA}^..${childSHA}`));
			} else {
				commandArray = command.commandArray.map(
					(item) => item.replace(SHA_PLACEHOLDER, `${SHA}`));
			}

			notifyWarning(`Running command "${commandArray.join(' ')}"`);

			if (command.foreground) {
				screen.spawn(commandArray[0], commandArray.slice(1), {});
			} else {
				await spawnPromise(commandArray[0], commandArray.slice(1));
			}

		} catch (errorMessage) {
			notifyError(`${errorMessage}`);
		}

		if (markedSHA) {
			unmarkAnchorCommit();
		}
	});

	return screen;
};
