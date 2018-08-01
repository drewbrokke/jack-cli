export interface ICommand {
	/**
	 * A string containing the command to run and its arguments.
	 * The placeholder variables are put into this string. This string supports
	 * pipes.
	 *
	 * REQUIRED.  If it is not given, jack will exit with an error.
	 *
	 * Example: 'git checkout [%SHA_SINGLE%]'
	 */
	command: string;

	/**
	 * An array of strings containing the command to run and its arguments.
	 * The placeholder variables are put into this array. This array supports
	 * pipes.
	 *
	 * DEPRECATED.
	 *
	 * Example: ['git', 'checkout', '[%SHA_SINGLE%]']
	 */
	commandArray?: string[];

	/**
	 * A description that will display whenever the command is invoked.
	 *
	 * REQUIRED. If it is not given, jack will exit with an error.
	 */
	description: string;

	/**
	 * Whether or not the process will spawn in the foreground.  By default,
	 * commands will run in the background and notify you when they have
	 * completed.  If this property is true, jack will try to spawn it as a
	 * foreground process.
	 *
	 * Please note that if the command does not run in a pager or an editor like
	 * less or vim, the process will complete and immediately return you to
	 * jack. You can work around this by piping to less or another pager in
	 * the command array.
	 *
	 * OPTIONAL.  Default is false.
	 */
	foreground?: boolean;

	/**
	 * The key used to invoke the command from jack. This can either be a single
	 * lowercase letter, or prefixed with "C-" for a "control" modifer key, or
	 * "S-" for a "shift" modifier key
	 *
	 * REQUIRED. If it is not given, jack will exit with an error.
	 *
	 * Example: 's', 'S-x', 'C-v'
	 */
	key: string;

	/**
	 * A command to run if there is an error with the main command.  This is not
	 * usually necessary, but can be useful for cleaning up after a command that
	 * leaves garbage if it fails, such as a 'git cherry-pick' or 'git rebase'.
	 *
	 * OPTIONAL
	 *
	 * Example: 'git rebase --abort'
	 * Example: 'git cherry-pick --abort'
	 */
	onErrorCommand?: string;

	/**
	 * Whether or not to refresh the log after the command has completed.
	 * This is useful for operations that change the log like `git rebase` or
	 * `git cherry-pick`.
	 *
	 * OPTIONAL. Default is false.
	 */
	refreshOnComplete?: boolean;
}

export enum Placeholder {
	/**
	 * Will be replaced by the commit message of the currently selected commit
	 *
	 * Example: "offers commit message variable for custom commands"
	 */
	COMMIT_MESSAGE = '[%COMMIT_MESSAGE%]',

	/**
	 * Will always be replaced by a revision range, even if there is no marked
	 * commit. Commands such as 'git diff' require this to show the changes for
	 * just a single commit.
	 *
	 * Single Commit Example:      4a22d67^..4a22d67
	 * With Marked Commit Example: 9103ae0^..4a22d67
	 */
	SHA_RANGE = '[%SHA_RANGE%]',

	/**
	 * Will be replaced by either a single commit SHA or a revision range if there
	 * is a marked commit.
	 *
	 * Single Commit Example:      4a22d67
	 * With Marked Commit Example: 9103ae0^..4a22d67
	 */
	SHA_SINGLE_OR_RANGE = '[%SHA_SINGLE_OR_RANGE%]',

	/**
	 * Will be replaced by the currently selected commit SHA.
	 *
	 * Single Commit Example:      4a22d67
	 * With Marked Commit Example: 4a22d67
	 */
	SHA_SINGLE = '[%SHA_SINGLE%]',
}

export const COMMANDS: ICommand[] = [
	/**
	 * Open a diff
	 */
	{
		command: `git -p diff ${
			Placeholder.SHA_RANGE
		} --patch --stat-width=1000`,
		description: 'View total diff',
		foreground: true,
		key: 'd',
	},

	/**
	 * List changed files
	 */
	{
		command: `git -p diff ${Placeholder.SHA_RANGE} --name-only`,
		description: 'View changed file names',
		foreground: true,
		key: 'n',
	},

	/**
	 * Open changes in a difftool
	 */
	{
		command: `git difftool ${Placeholder.SHA_RANGE}`,
		description: 'Open total diff in difftool',
		key: 't',
	},

	/**
	 * Attempt a cherry-pick
	 */
	{
		command: `git cherry-pick ${Placeholder.SHA_SINGLE_OR_RANGE}`,
		description: 'Cherry-pick commits',
		key: 'S-c',
		onErrorCommand: 'git cherry-pick --abort',
	},

	/**
	 * Begin an interactive rebase
	 */
	{
		command: `git rebase -i ${Placeholder.SHA_SINGLE}^`,
		description: 'Perform interactive rebase',
		foreground: true,
		key: 'S-i',
		onErrorCommand: 'git rebase --abort',
		refreshOnComplete: true,
	},
];
