export enum ModifierKey {
	CONTROL = 'Control',
	SHIFT = 'Shift',
}

export interface ICommandOptions {
	/**
	 * An array of strings containing the command to run and its arguments.
	 * The placeholder variables are put into this array.
	 *
	 * REQUIRED.  If it is not given, jack will exit with an error.
	 *
	 * Example: ['git', 'checkout', '[% SHA_SINGLE %]']
	 */
	commandArray: string[];

	/**
	 * A description that will display whenever the command is invoked.
	 *
	 * OPTIONAL
	 */
	description?: string;

	/**
	 * Whether or not the process will spawn in the foreground.  By default,
	 * commands will run in the background and notify you when they have
	 * completed.  If this property is true, jack will try to spawn it as a
	 * foreground process.
	 *
	 * Please note that if the command does not run in a pager or an editor like
	 * less or vim, the process will complete and immediately return you to
	 * jack.
	 *
	 * OPTIONAL.  Default is false.
	 */
	foreground?: boolean;

	/**
	 * The key used to invoke the command from jack.
	 *
	 * The value is case insensitive.
	 *
	 * REQUIRED. If it is not given, jack will exit with an error.
	 */
	key: string;

	/**
	 * The modifier key to use with the key.
	 *
	 * Valid values are 'Control' and 'Shift'. Any other values are ignored.
	 *
	 * OPTIONAL
	 */
	modifierKey?: ModifierKey;

	/**
	 * A command to run if there is an error with the main command.  This is not
	 * usually necessary, but can be useful for cleaning up after a command that
	 * leaves garbage if it fails, such as a 'git cherry-pick' or 'git rebase'.
	 *
	 * OPTIONAL
	 *
	 * Example: ['git', 'rebase', '--abort']
	 * Example: ['git', 'cherry-pick', '--abort']
	 */
	onErrorCommand?: string[] | null;
}

export interface ICommand extends ICommandOptions {
	getKeyEventString(): string;
}

/**
 * Will be replaced by the currently selected commit SHA.
 *
 * Single Commit Example:      4a22d67
 * With Marked Commit Example: 4a22d67
 */
export const SHA_SINGLE_PLACEHOLDER = '[% SHA_SINGLE %]';

/**
 * Will always be replaced by a revision range, even if there is no marked
 * commit. Commands such as 'git diff' require this to show the changes for just
 * a single commit.
 *
 * Single Commit Example:      4a22d67^..4a22d67
 * With Marked Commit Example: 9103ae0^..4a22d67
 */
export const SHA_RANGE_PLACEHOLDER = '[% SHA_RANGE %]';

/**
 * Will be replaced by either a single commit SHA or a revision range if there
 * is a marked commit.
 *
 * Single Commit Example:      4a22d67
 * With Marked Commit Example: 9103ae0^..4a22d67
 */
export const SHA_SINGLE_OR_RANGE_PLACEHOLDER = '[% SHA_SINGLE_OR_RANGE %]';

/**
 * Will be replaced by the commit message of the currently selected commit
 *
 * Example: "offers commit message variable for custom commands"
 */
export const COMMIT_MESSAGE_PLACEHOLDER = '[% COMMIT_MESSAGE %]';

const RESERVED_KEYS = [
	...('befgjkmqxy1234567890?'.split('')),
	'escape', 'C-c', 'S-j', 'S-k',
];

const validKeysRegex = new RegExp(/[A-Za-z]/);

// tslint:disable-next-line:only-arrow-functions
export const constructCommand = (commandOptions: ICommandOptions): ICommand => {
	const { commandArray } = commandOptions;

	if (!commandArray || !Array.isArray(commandArray) ||
		commandArray.length === 0) {

		crashCommandRegistrationError(
			'There must be an array to declare a command and its arguments.\n\n',
			commandOptions);
	}

	const { key } = commandOptions;

	if (!key || typeof key !== 'string') {
		crashCommandRegistrationError(
			'There must be a "key" property given to trigger the command:',
			commandOptions);
	}

	if (!validKeysRegex.test(key)) {
		crashCommandRegistrationError(
			`The key parameter must be a letter`, commandOptions);
	}

	const command = {
		foreground: false,
		...commandOptions,
		getKeyEventString() {
			const keyString = this.key.toLowerCase();

			switch (this.modifierKey) {
				case ModifierKey.CONTROL:
					return `C-${keyString}`;

				case ModifierKey.SHIFT:
					return `S-${keyString}`;

				default:
					return keyString;
			}
		},
	};

	const keyEventString = command.getKeyEventString();

	if (RESERVED_KEYS.includes(keyEventString)) {
		crashCommandRegistrationError(
			// tslint:disable-next-line:max-line-length
			`The key combination "${keyEventString}" is reserved. Here is the list of reserved key combinations: ${RESERVED_KEYS.join(' ')}`,
			commandOptions);
	}

	return command;
};

const crashCommandRegistrationError =
	(errorMessage: string, command?: ICommandOptions) => {
		process.stderr.write(
			'There was a problem registering a custom command from your ' +
			'.jack.json config file:\n\n');
		process.stderr.write(errorMessage + '\n\n');

		if (command) {
			process.stderr.write('Fix this command object:\n');
			process.stderr.write(JSON.stringify(command, null, '    ') + '\n');
		}

		process.exit(1);
	};

export const COMMANDS: ICommandOptions[] = [
	/**
	 * Open a diff
	 */
	{
		commandArray: [
			'git',
			'-p',
			'diff',
			SHA_RANGE_PLACEHOLDER,
			'--patch',
			'--stat-width=1000',
		],
		description: 'View total diff',
		foreground: true,
		key: 'd',
	},

	/**
	 * List changed files
	 */
	{
		commandArray: ['git', '-p', 'diff', SHA_RANGE_PLACEHOLDER, '--name-only'],
		description: 'View changed file names',
		foreground: true,
		key: 'n',
	},

	/**
	 * Open changes in a difftool
	 */
	{
		commandArray: ['git', 'difftool', SHA_RANGE_PLACEHOLDER],
		description: 'Open total diff in difftool',
		key: 't',
	},

	/**
	 * Attempt a cherry-pick
	 */
	{
		commandArray: ['git', 'cherry-pick', SHA_SINGLE_OR_RANGE_PLACEHOLDER],
		description: 'Cherry-pick commits',
		key: 'c',
		modifierKey: ModifierKey.SHIFT,
		onErrorCommand: ['git', 'cherry-pick', '--abort'],
	},

	/**
	 * Begin an interactive rebase
	 */
	{
		commandArray: ['git', 'rebase', '-i', SHA_SINGLE_PLACEHOLDER + '^'],
		description: 'Perform interactive rebase',
		foreground: true,
		key: 'i',
		modifierKey: ModifierKey.SHIFT,
		onErrorCommand: ['git', 'rebase', '--abort'],
	},
];
