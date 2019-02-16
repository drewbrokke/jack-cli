# jack

**jack** is `git log` with actions.

It allows you call `git log` like normal, then act on that log in virtually any way you'd like. There are a lot of built-in commands (like pressing `space` to call `git show` on the current commit), but you can assign a **custom command** to almost any key, and **jack** will call it and pass along the info you need.

## Why?

`git log` is much faster and more flexible than most Git GUI apps, but I got tired of always calling `git log`, then copying the commit hash, then calling `git show` on that hash. I wanted an experience like "Quick Look" on macOS - one key press to see what you need, another to go back.

After I built that, I wanted to be able to _do more_, so I added custom commands.

## Installation

```
npm i -g jack-cli
```

**jack** currently requires node version 4+.

## Usage

### Viewing a Git log

Just use `jack` instead of `git log`! Since **jack** calls `git log` and passes in all the arguments, you don't have to learn a new syntax.

```
jack

jack --grep 'some commit message pattern'

jack 00ca1d8efd20^..head

jack -n 100
```

You can then perform actions on the log using the keys below.

### Built-in Key Commands

**Preset Keys**

-   C = Control key
-   S = Shift key

| Key              | Description                                    |
| ---------------- | ---------------------------------------------- |
| **Space, Enter** | View a commit's contents (toggle)              |
| **j/k, down/up** | (list view) Navgate between commits            |
| **0-9**          | (list view) Set a movement interval (like Vim) |
| **j/k, down/up** | (commit view) scroll down or up                |
| **left/right**   | (commit view) View previous/next commit        |
| **x**            | Mark a commit as a range anchor                |
| **e**            | Open diff in default editor                    |
| **o**            | Open changed files in default editor           |
| **m**            | Copy commit message to clipboard               |
| **y**            | Copy commit SHA to clipboard                   |
| **r**            | Refresh the list                               |
| **q, esc, C-c**  | Exit **jack**                                  |
| **?**            | Show/hide help dialog                          |

## Custom key commands

`jack` can register custom key commands, meaning you can call any executable from `jack`. When `jack` starts up, it will create a `.jack.json` file in your home directory, where you can define command objects in this shape:

```
{
	commandArray: [
		'git',
		'-p',
		'diff',
		'[%SHA_RANGE%]',
		'--patch',
		'--stat-width=1000',
	],
	description: 'View total diff',
	foreground: true,
	key: 'd',
}
```

A full explanation of each property can be found in the comments of [commands-def.ts#L12-L77](https://github.com/drewbrokke/jack-cli/blob/master/src/util/commands-def.ts#L12-L77).

`jack` actually registers several key commands this way internally! See [commands-def.ts#L178-L236](https://github.com/drewbrokke/jack-cli/blob/master/src/util/commands-def.ts#L178-L236) for some examples.

### Placeholder variables

`jack` defines several placeholder variables to be used in your custom scripts:

-   "[%COMMIT_MESSAGE%]"
-   "[%SHA_RANGE%]"
-   "[%SHA\_SINGLE\_OR_RANGE%]"
-   "[%SHA_SINGLE%]"

A full explanation of each variable is provided in the comments of [commands-def.ts#L79-L114](https://github.com/drewbrokke/jack-cli/blob/master/src/util/commands-def.ts#L79-L114).

### Other configuration options

**blacklistPatterns**

```json
{
	"blacklistPatterns": ["exception1", "exception2"]
}
```

Type: String Array

When evaluating which lines contain commit hashes, jack will skip lines that match any of the Regex strings in the array.

### Environment variables

**JACK_CLI_CONFIG_FILE_PATH**

```
JACK_CLI_CONFIG_FILE_PATH="/users/username/path/to/custom-jack-config.json"
```

If you would like to use `jack` with different configuration files for different shell user logins, you can point to a custom json file by setting the JACK_CLI_CONFIG_FILE_PATH environment variable. If the file doesn't exist, `jack` will create it when it first starts up.
