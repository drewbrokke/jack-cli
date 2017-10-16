export enum ModifierKey {
	CONTROL = 'CONTROL',
	SHIFT = 'SHIFT',
}

export interface ICommand {
	acceptsRange?: boolean;
	commandArray: string[];
	forceRange?: boolean;
	foreground?: boolean;
	key: string;
	modifierKey?: ModifierKey;
	onErrorCommand?: string[] | null;
}

const defaultCommandOpts = {
	acceptsRange: true,
	forceRange: false,
	foreground: false,
};

export const SHA_PLACEHOLDER = '<%-- SHA --%>';

export const COMMANDS: ICommand[] = [
	/**
	 * Open a diff
	 */
	constructCommand({
		commandArray: [
			'git',
			'-p',
			'diff',
			SHA_PLACEHOLDER,
			'--patch',
			'--stat-width=1000',
		],
		forceRange: true,
		foreground: true,
		key: 'd',
	}),

	/**
	 * List changed files
	 */
	constructCommand({
		commandArray: ['git', '-p', 'diff', SHA_PLACEHOLDER, '--name-only'],
		forceRange: true,
		foreground: true,
		key: 'n',
	}),

	/**
	 * Open changes in a difftool
	 */
	constructCommand({
		commandArray: ['git', 'difftool', SHA_PLACEHOLDER],
		forceRange: true,
		key: 't',
	}),

	/**
	 * Attempt a cherry-pick
	 */
	constructCommand({
		commandArray: ['git', 'cherry-pick', SHA_PLACEHOLDER],
		key: 'c',
		modifierKey: ModifierKey.SHIFT,
		onErrorCommand: ['git', 'cherry-pick', '--abort'],
	}),

	/**
	 * Begin an interactive rebase
	 */
	constructCommand({
		acceptsRange: false,
		commandArray: ['git', 'rebase', '-i', SHA_PLACEHOLDER + '^'],
		foreground: true,
		key: 'i',
		modifierKey: ModifierKey.SHIFT,
		onErrorCommand: ['git', 'rebase', '--abort'],
	}),
];

// Helper Functions

// tslint:disable-next-line:only-arrow-functions
function constructCommand(command: ICommand): ICommand {
	const { commandArray } = command;

	if (!commandArray || !Array.isArray(commandArray) ||
		commandArray.length === 0) {

		crashError(
			'There must be an array to declare a command and its arguments.\n\n');
	}

	const { key } = command;

	if (!key || typeof key !== 'string') {
		crashError('There must be key given to trigger the command');
	}

	return {
		...defaultCommandOpts,
		...command,
	};
}

const crashError = (errorMessage: string, command?: ICommand) => {
	process.stderr.write(errorMessage);

	if (command) {
		process.stderr.write(JSON.stringify(command));
	}

	process.exit(1);
};
