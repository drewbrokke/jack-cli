import { getCommands } from './command-util';
import { ICommand } from './commands-def';

const documentCommands = (commands: ICommand[]) => {
	return commands.reduce(
		(accumulator, command) =>
			`${accumulator}
{bold}${pad(6, command.key)} ->   ${command.description}{/bold}
			${command.command}`,
		'{bold}Registered Keys{/bold}\n',
	);
};

const getPresetKeysText = () => {
	const keys = [
		[`Space, Enter`, `"Quick Look" a commit's contents (toggle)`],
		[`j/k, down/up`, `(list view) Navigate between commits`],
		[`0-9`, `(list view) Set a movement interval (like Vim)`],
		[`j/k, down/up`, `(commit view) scroll down`],
		[`left/right`, `(commit view) View previous/next commit`],
		['', ''],
		[`/`, `Focus search bar.  Press enter to begin search.`],
		[`n`, `Jump to next search result`],
		[`N`, `Jump to previous search result`],
		['', ''],
		[`x`, `Mark a commit as a range anchor`],
		[`e`, `Open diff in default editor`],
		[`o`, `Open changed files in default editor`],
		[`m`, `Copy commit message to clipboard`],
		[`y`, `Copy commit SHA to clipboard`],
		['', ''],
		[`r`, `Refresh the list`],
		[`q, esc, C-c`, `Exit {bold}jack{/bold}`],
		[`?`, `Show/hide help dialog`],
	];

	const longest: number = keys.reduce(
		(acc: number, [key]) => Math.max(acc, key.length),
		0,
	);

	return keys
		.map(
			([key, value]) =>
				key.length
					? `{bold}${pad(longest + 2, key)}{/bold} ->  ${value}`
					: '',
		)
		.join('\n');
};

const pad = (l: number, s: string) => {
	const delta = l - s.length;

	if (delta > 0) {
		s += ' '.repeat(delta);
	}

	return s;
};

export const HELP_TEXT = `
{bold}Preset Keys{/bold}

C = Control key
S = Shift key

${getPresetKeysText()}

${documentCommands(getCommands())}
`;
