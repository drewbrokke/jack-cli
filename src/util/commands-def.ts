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
		forceRange: true,
		foreground: true,
		key: 'd',
	},

	/**
	 * List changed files
	 */
	{
		commandArray: ['git', '-p', 'diff', SHA_PLACEHOLDER, '--name-only'],
		forceRange: true,
		foreground: true,
		key: 'n',
	},

	/**
	 * Open changes in a difftool
	 */
	{
		commandArray: ['git', 'difftool', SHA_PLACEHOLDER],
		forceRange: true,
		key: 't',
	},

	/**
	 * Attempt a cherry-pick
	 */
	{
		commandArray: ['git', 'cherry-pick', SHA_PLACEHOLDER],
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
		foreground: true,
		key: 'i',
		modifierKey: ModifierKey.SHIFT,
		onErrorCommand: ['git', 'rebase', '--abort'],
	},
];

// Helper Functions
