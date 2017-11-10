import { getCommands } from './command-util';
import { ICommand } from './commands-def';

export const getHelpText = () => {
	const documentedCommands = documentCommands(getCommands());

	return helpText + documentedCommands;
};

const documentCommands = (commands: ICommand[]) => {
	const title = '{bold}Registered Key Commands{/bold}\n\n';
	const commandDocs = commands.map((command) => {
		const { commandArray, description } = command;
		const commandText = commandArray.join(' ');

		return `{bold}${pad(command.key)} ->   ${description}{/bold}
            ${commandText}
`;
	}).join('\n');

	return title + commandDocs;
};

const helpText = `
{bold}Preset Keys{/bold}

C = Control key
S = Shift key

{bold}Space, Enter{/bold}    ->  "Quick Look" a commit's contents (toggle)
{bold}j/k, down/up{/bold}    ->  (list view) Navgate between commits
{bold}0-9{/bold}             ->  (list view) Set a movement interval (like Vim)
{bold}j/k, down/up{/bold}    ->  (commit view) scroll down
{bold}left/right{/bold}      ->  (commit view) View previous/next commit

{bold}x{/bold}               ->  Mark a commit as a range anchor
{bold}e{/bold}               ->  Open diff in default editor
{bold}o{/bold}               ->  Open changed files in default editor
{bold}m{/bold}               ->  Copy commit message to clipboard
{bold}y{/bold}               ->  Copy commit SHA to clipboard

{bold}q, esc, C-c{/bold}     ->  Exit {bold}jack{/bold}
{bold}?{/bold}               ->  Show/hide help dialog

`;

const pad = (s: string) => {
	const delta = 6 - s.length;

	if (delta > 0) {
		s += ' '.repeat(delta);
	}

	return s;
};
