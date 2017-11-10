# jack
Chop through that Git log wicked fast

**jack** is an interactive drop-in replacement for `git log`.  It allows you to view a list of commits and "quick-look" their changes and act on them right from the command line.  `git log`'s filtering and logging flexibility is so much better than almost all GUI apps, so in most cases, this will be a much faster way to review a series of commits/changes.

## Installation
```
npm i -g jack-cli
```

## Usage
### Viewing a Git log
Use normal `git log` syntax.  **jack** just calls `git log` and passes all arguments.
```
jack

jack --grep 'some commit message pattern'

jack 00ca1d8efd20^..head

jack -n 100
```

### Key Commands

**Preset Keys**

- C = Control key
- S = Shift key

Key | Description
------ | -----
**Space, Enter**    |  "Quick Look" a commit's contents (toggle)
**j/k, down/up**    |  (list view) Navgate between commits
**0-9**             |  (list view) Set a movement interval (like Vim)
**j/k, down/up**    |  (commit view) scroll down or up
**left/right**      |  (commit view) View previous/next commit
**x**               |  Mark a commit as a range anchor
**e**               |  Open diff in default editor
**o**               |  Open changed files in default editor
**m**               |  Copy commit message to clipboard
**y**               |  Copy commit SHA to clipboard
**q, esc, C-c**     |  Exit **jack**
**?**               |  Show/hide help dialog

## Custom key commands

`jack` can register custom key commands, meaning you can call any executable from `jack`.  When `jack` starts up, it will create a `.jack.json` file in your home directory, where you can define command objects in this shape:
```
{
	commandArray: [
		'git',
		'-p',
		'diff',
		'[% SHA_RANGE %]',
		'--patch',
		'--stat-width=1000',
	],
	description: 'View total diff',
	foreground: true,
	key: 'd',
}
```
A full explanation of each property can be found in the comments of [commands-def.ts#L12-L68](https://github.com/drewbrokke/jack-cli/blob/master/src/util/commands-def.ts#L12-L68).

`jack` actually registers several key commands this way internally!  See [commands-def.ts#L165-L222](https://github.com/drewbrokke/jack-cli/blob/master/src/util/commands-def.ts#L165-L222) for some examples.

### Placeholder variables
`jack` defines several placeholder variables to be used in your custom scripts:
- "[% COMMIT_MESSAGE %]"
- "[% SHA_RANGE %]"
- "[% SHA\_SINGLE\_OR_RANGE %]"
- "[% SHA_SINGLE %]"

A full explanation of each variable is provided in the comments of [commands-def.ts#L70-L105](https://github.com/drewbrokke/jack-cli/blob/master/src/util/commands-def.ts#L70-L105).
