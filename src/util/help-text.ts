import { colors } from './colors';
import { getCommands } from './command-util';
import { Command } from './commands-def';
import { getUseLegacyEscapeKeyBehavior } from './config-util';

const { emphasis } = colors;

const documentCommands = (commands: Command[]) => {
	return commands.reduce(
		(accumulator, command) =>
			`${accumulator}${emphasis(pad(6, command.key))} ->   ${emphasis(
				command.description,
			)}
            ${command.command}
`,
		'',
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
		[`o`, `Open changed files in default editor`],
		[`m`, `Copy commit message to clipboard`],
		[`y`, `Copy commit SHA to clipboard`],
		['', ''],
		[`?`, `Show/hide help dialog`],
		[`r`, `Refresh the list`],
	];

	if (getUseLegacyEscapeKeyBehavior()) {
		keys.push([`q, esc, C-c`, `Exit ${emphasis('jack')}`]);
	} else {
		keys.push([`esc`, `Return to default view`])
		keys.push([`q, C-c`, `Exit ${emphasis('jack')}`]);
	}

	const longest: number = keys.reduce(
		(acc: number, [key]) => Math.max(acc, key.length),
		0,
	);

	return keys
		.map(([key, value]) =>
			key.length ? emphasis(`${pad(longest + 2, key)} ->  ${value}`) : '',
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

export const HELP_TEXT = `${emphasis('Preset Keys')}

C = Control key
S = Shift key

${getPresetKeysText()}

${emphasis('Registered Keys')}

${documentCommands(getCommands())}
`;
