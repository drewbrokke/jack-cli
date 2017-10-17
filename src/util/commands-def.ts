export enum ModifierKey {
	CONTROL = 'CONTROL',
	SHIFT = 'SHIFT',
}

export interface ICommand {
	acceptsRange?: boolean;
	commandArray: string[];
	description?: string;
	forceRange?: boolean;
	foreground?: boolean;
	key: string;
	modifierKey?: ModifierKey;
	onErrorCommand?: string[] | null;
}

export const COMMIT_MESSAGE_PLACEHOLDER = '[% COMMIT MESSAGE %]';
export const SHA_PLACEHOLDER = '[% SHA %]';

export const COMMANDS: ICommand[] = [
	/**
	 * Open a diff
	 */
	{
		commandArray: [
			'git',
			'-p',
			'diff',
			SHA_PLACEHOLDER,
			'--patch',
			'--stat-width=1000',
		],
		description: 'View total diff',
		forceRange: true,
		foreground: true,
		key: 'd',
	},

	/**
	 * List changed files
	 */
	{
		commandArray: ['git', '-p', 'diff', SHA_PLACEHOLDER, '--name-only'],
		description: 'View changed file names',
		forceRange: true,
		foreground: true,
		key: 'n',
	},

	/**
	 * Open changes in a difftool
	 */
	{
		commandArray: ['git', 'difftool', SHA_PLACEHOLDER],
		description: 'Open total diff in difftool',
		forceRange: true,
		key: 't',
	},

	/**
	 * Attempt a cherry-pick
	 */
	{
		commandArray: ['git', 'cherry-pick', SHA_PLACEHOLDER],
		description: 'Cherry-pick commits',
		key: 'c',
		modifierKey: ModifierKey.SHIFT,
		onErrorCommand: ['git', 'cherry-pick', '--abort'],
	},

	/**
	 * Begin an interactive rebase
	 */
	{
		acceptsRange: false,
		commandArray: ['git', 'rebase', '-i', SHA_PLACEHOLDER + '^'],
		description: 'Perform interactive rebase',
		foreground: true,
		key: 'i',
		modifierKey: ModifierKey.SHIFT,
		onErrorCommand: ['git', 'rebase', '--abort'],
	},
];
