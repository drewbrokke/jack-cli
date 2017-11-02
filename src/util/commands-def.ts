export enum Modifier {
	CONTROL = 'control',
	SHIFT = 'shift',
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
	modifier?: Modifier;

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

export enum Placeholder {

	/**
	 * Will be replaced by the commit message of the currently selected commit
	 *
	 * Example: "offers commit message variable for custom commands"
	 */
	COMMIT_MESSAGE = '[% COMMIT_MESSAGE %]',

	/**
	 * Will be replaced by the list of files changed by the commit or revision
	 * range, separated by a newline
	 */
	FILES = '[% FILES %]',

	/**
	 * Will always be replaced by a revision range, even if there is no marked
	 * commit. Commands such as 'git diff' require this to show the changes for
	 * just a single commit.
	 *
	 * Single Commit Example:      4a22d67^..4a22d67
	 * With Marked Commit Example: 9103ae0^..4a22d67
	 */
	SHA_RANGE = '[% SHA_RANGE %]',

	/**
	 * Will be replaced by either a single commit SHA or a revision range if there
	 * is a marked commit.
	 *
	 * Single Commit Example:      4a22d67
	 * With Marked Commit Example: 9103ae0^..4a22d67
	 */
	SHA_SINGLE_OR_RANGE = '[% SHA_SINGLE_OR_RANGE %]',

	/**
	 * Will be replaced by the currently selected commit SHA.
	 *
	 * Single Commit Example:      4a22d67
	 * With Marked Commit Example: 4a22d67
	 */
	SHA_SINGLE = '[% SHA_SINGLE %]',
}

const RESERVED_KEYS = [
	...('befgjkmqxy1234567890?'.split('')),
	'escape', 'C-c', 'S-j', 'S-k',
];

const VALID_KEYS_REGEX = new RegExp(/^[A-Za-z]$/);

const DUMMY_COMMAND_OPTIONS: ICommandOptions = {
	commandArray: [],
	description: '',
	foreground: false,
	key: '',
	modifier: undefined,
	onErrorCommand: null,
};

const COMMAND_OPTION_KEYS = Object.keys(DUMMY_COMMAND_OPTIONS);

// tslint:disable-next-line:only-arrow-functions
export const constructCommand = (commandOptions: ICommandOptions): ICommand => {
	const invalidKeys = Object.keys(commandOptions)
		.filter((keyName) => !COMMAND_OPTION_KEYS.includes(keyName));

	if (invalidKeys.length) {
		crashCommandRegistrationError(
			`The following keys are invalid: "${invalidKeys.join(', ')}"

Possible valid keys: ${COMMAND_OPTION_KEYS.join(', ')}`,
			commandOptions);
	}

	const { commandArray, key, modifier } = commandOptions;

	if (!commandArray || !Array.isArray(commandArray) ||
		commandArray.length === 0) {

		crashCommandRegistrationError(
			'The "commandArray" property must be declared as an array of ' +
			'strings defining a command and its arguments',
			commandOptions);
	}

	if (!key || typeof key !== 'string') {
		crashCommandRegistrationError(
			'There must be a "key" property given to trigger the command:',
			commandOptions);
	}

	if (!VALID_KEYS_REGEX.test(key)) {
		crashCommandRegistrationError(
			'The "key" property must be a single letter', commandOptions);
	}

	if (modifier) {
		switch (modifier) {
			case Modifier.CONTROL:
			case Modifier.SHIFT:
				break;

			default:
				const properties = Object.keys(Modifier).map(
					(i) => `"${Modifier[i]}"`).join(' ');

				crashCommandRegistrationError(
					'The "modifier" property must have one of the following values: ' +
					properties,
					commandOptions);
				break;
		}

	}

	const command = {
		foreground: false,
		...commandOptions,
		getKeyEventString() {
			const keyString = this.key.toLowerCase();

			switch (this.modifier) {
				case Modifier.CONTROL:
					return `C-${keyString}`;

				case Modifier.SHIFT:
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
			Placeholder.SHA_RANGE,
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
		commandArray: ['git', '-p', 'diff', Placeholder.SHA_RANGE, '--name-only'],
		description: 'View changed file names',
		foreground: true,
		key: 'n',
	},

	/**
	 * Open changes in a difftool
	 */
	{
		commandArray: ['git', 'difftool', Placeholder.SHA_RANGE],
		description: 'Open total diff in difftool',
		key: 't',
	},

	/**
	 * Attempt a cherry-pick
	 */
	{
		commandArray: ['git', 'cherry-pick', Placeholder.SHA_SINGLE_OR_RANGE],
		description: 'Cherry-pick commits',
		key: 'c',
		modifier: Modifier.SHIFT,
		onErrorCommand: ['git', 'cherry-pick', '--abort'],
	},

	/**
	 * Begin an interactive rebase
	 */
	{
		commandArray: ['git', 'rebase', '-i', Placeholder.SHA_SINGLE + '^'],
		description: 'Perform interactive rebase',
		foreground: true,
		key: 'i',
		modifier: Modifier.SHIFT,
		onErrorCommand: ['git', 'rebase', '--abort'],
	},
];
