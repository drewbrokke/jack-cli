export enum ModifierKey {
	CONTROL = 'Control',
	SHIFT = 'Shift',
}

export interface ICommand {
	commandArray: string[];
	description?: string;
	foreground?: boolean;
	key: string;
	modifierKey?: ModifierKey;
	onErrorCommand?: string[] | null;
}

export const SHA_SINGLE_PLACEHOLDER = '[% SHA_SINGLE %]';
export const SHA_RANGE_PLACEHOLDER = '[% SHA_RANGE %]';
export const SHA_SINGLE_OR_RANGE_PLACEHOLDER = '[% SHA_SINGLE_OR_RANGE %]';
export const COMMIT_MESSAGE_PLACEHOLDER = '[% COMMIT_MESSAGE %]';

export const COMMANDS: ICommand[] = [
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
