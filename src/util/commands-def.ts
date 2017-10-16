export enum ModifierKey {
	CONTROL = 'CONTROL',
	NONE = 'NONE',
	SHIFT = 'SHIFT',
}

export interface ICommand {
	acceptsRange: boolean;
	commandArray: string[];
	forceRange?: boolean;
	foreground: boolean;
	key: string;
	modifierKey: ModifierKey;
	onErrorCommand?: string[];
}

export const SHA_PLACEHOLDER = '<%-- SHA --%>';

export const COMMANDS: ICommand[] = [
	/**
	 * Open a diff
	 */
	{
		acceptsRange: true,
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
		modifierKey: ModifierKey.NONE,
	},

	/**
	 * List changed files
	 */
	{
		acceptsRange: true,
		commandArray: ['git', '-p', 'diff', SHA_PLACEHOLDER, '--name-only'],
		forceRange: true,
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
		forceRange: true,
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

	{
		acceptsRange: false,
		commandArray: ['echo', 'helloo world'],
		foreground: true,
		key: 'h',
		modifierKey: ModifierKey.NONE,
	},
];
