<!-- markdownlint-disable list-marker-space -->

# Table of Contents

- [Table of Contents](#table-of-contents)
- [jack](#jack)
- [Motivation](#motivation)
- [Installation](#installation)
- [Usage](#usage)
  - [Viewing a Git log](#viewing-a-git-log)
  - [Built-in Key Commands](#built-in-key-commands)
    - [Meta](#meta)
    - [Navigation](#navigation)
    - [Searching](#searching)
    - [Actions](#actions)
- [Configuration](#configuration)
  - [Configuration options](#configuration-options)
    - [**blacklistPatterns**](#blacklistpatterns)
    - [**commands**](#commands)
    - [**gitShowOptions**](#gitshowoptions)
    - [**notificationTimeout**](#notificationtimeout)
    - [**showLineNumbers**](#showlinenumbers)
  - [The `Command` object](#the-command-object)
    - [**command (Required)**](#command-required)
    - [**description (Required)**](#description-required)
    - [**foreground (Optional)**](#foreground-optional)
    - [**key (Required)**](#key-required)
    - [**onErrorCommand (Optional)**](#onerrorcommand-optional)
    - [**refreshOnComplete (Optional)**](#refreshoncomplete-optional)
  - [Placeholder tokens](#placeholder-tokens)
    - [**COMMIT_MESSAGE**](#commit_message)
    - [**SHA_RANGE**](#sha_range)
    - [**SHA_SINGLE_OR_RANGE**](#sha_single_or_range)
    - [**SHA_SINGLE**](#sha_single)
  - [Environment variables](#environment-variables)
    - [JACK_CLI_CONFIG_FILE_PATH](#jack_cli_config_file_path)
  - [Miscellaneous](#miscellaneous)
    - [**Why does the `foreground` option for my custom command not work?**](#why-does-the-foreground-option-for-my-custom-command-not-work)
    - [**iTerm drag and drop is potentially dangerous while using `jack`**](#iterm-drag-and-drop-is-potentially-dangerous-while-using-jack)

# jack

`jack` is `git log` with actions.

It allows you call `git log` like normal, then act on that log in virtually any way you'd like. There are a lot of built-in commands (like pressing `space` to call `git show` on the current commit), but you can assign a **custom command** to almost any key, and `jack` will call it and pass along the info you need.

# Motivation

`git log` is much faster and more flexible than most Git GUI apps, but I got tired of always calling `git log`, then copying the commit hash, then calling `git show` on that hash. I wanted an experience like "Quick Look" on macOS - one key press to see what you need, another to go back.

After I built that, I wanted to be able to _do more_, so I added custom commands.

# Installation

```shell
npm i -g jack-cli
```

`jack` currently requires node version 4+.

# Usage

## Viewing a Git log

Just use `jack` instead of `git log`! Since `jack` calls `git log` and passes in all the arguments, you don't have to learn a new syntax.

```shell
jack

jack --grep 'some commit message pattern'

jack 00ca1d8efd20^..head

jack -n 100
```

You can then perform actions on the log using the keys below.

## Built-in Key Commands

Modifier Keys:

-   C = Control key
-   S = Shift key

### Meta

| Key             | Description           |
| --------------- | --------------------- |
| **q, esc, C-c** | Exit `jack`           |
| **?**           | Show/hide help dialog |

### Navigation

| Key              | Description                                    |
| ---------------- | ---------------------------------------------- |
| **Space, Enter** | View a commit's contents (toggle)              |
| **j/k, down/up** | (list view) Navigate between commits           |
| **0-9**          | (list view) Set a movement interval (like Vim) |
| **j/k, down/up** | (commit view) scroll down or up                |
| **left/right**   | (commit view) View previous/next commit        |

### Searching

| Key   | Description                                    |
| ----- | ---------------------------------------------- |
| **/** | Focus search bar. Press enter to begin search. |
| **n** | Jump to next search result                     |
| **N** | Jump to previous search result                 |

### Actions

| Key   | Description                          |
| ----- | ------------------------------------ |
| **x** | Mark a commit as a range anchor      |
| **o** | Open changed files in default editor |
| **m** | Copy commit message to clipboard     |
| **y** | Copy commit SHA to clipboard         |
| **r** | Refresh the list                     |

# Configuration

On first startup, `jack` will create a `.jack.json` file in your home directory. `jack` will read configuration options from this file.

You can change which JSON file is read by setting the [`JACK_CLI_CONFIG_FILE_PATH`](#jackcliconfigfilepath) environment variable.

## Configuration options

These options can be configured in the `.jack.json` file:

### **blacklistPatterns**

**Type**: String[]

**Default**: `[]`

**Description**: When evaluating which lines contain commit hashes, `jack` will skip lines that match any of the Regex strings in the array.

**Example**:

```json
{
    "blacklistPatterns": ["exception1", "exception2"]
}
```

### **commands**

**Type**: Command[]

**Default**: `[]`

**Description**: An array of custom key commands to be registered to `jack`. These can correspond to any shell command. `jack` will replace any tokens found in the command string with information about the current commit. See [The `Command` object](#the-command-object) for more information.

**Example**:

```json
{
    "commands": [
        {
            "command": "git -p diff [%SHA_RANGE%] --patch --stat-width=1000",
            "description": "View total diff",
            "foreground": true,
            "key": "d"
        },
        {
            "command": "git -p diff [%SHA_RANGE%] --name-only | less",
            "description": "View changed file names",
            "foreground": true,
            "key": "l"
        },
        {
            "command": "git revert [%SHA_SINGLE_OR_RANGE%]",
            "description": "Revert commit",
            "key": "S-r",
            "onErrorCommand": "git cherry-pick --abort",
            "refreshOnComplete": true
        }
    ]
}
```

### **gitShowOptions**

**Type**: String

**Default**: `"--patch-with-stat --stat-width 1000 --color"`

**Description**: A string of command-line options and flags that are passed to `git show` when the spacebar is pressed on a commit.

### **notificationTimeout**

**Type**: Number

**Default**: `5000`

**Description**: The duration in milliseconds that notifications will stay on the screen.

### **showLineNumbers**

**Type**: Boolean

**Default**: `false`

**Description**: Whether or not to show line numbers.

## The `Command` object

You can register custom key commands with jack using the [`commands`](#commands) property, which is an array of Command objects. A command can correspond to any shell command.

A Command object will look something like this:

```json
{
    "command": "git -p diff [%SHA_RANGE%] --patch --stat-width=1000",
    "description": "View total diff",
    "foreground": true,
    "key": "d"
}
```

The Command object takes the following properties:

### **command (Required)**

**Type**: String

**Description**: The shell command to be called on keypress. This string can contain [tokens](#placeholder-tokens) that will be replaced with information from the current commit.

### **description (Required)**

**Type**: String

**Description**: A description of the command to display in the help text, and whenever the command is invoked.

### **foreground (Optional)**

**Type**: Boolean

**Default**: `false`

**Description**: Whether or not the process will spawn in the foreground. By default, commands will run in the background and notify you when they have completed. If this property is true, `jack` will try to spawn it as a foreground process. Please note that if the command does not run in a pager or an editor like less or vim, the process will complete and immediately return you to `jack`. You can work around this by piping to less or another pager in the command.

### **key (Required)**

**Type**: String

**Description**: The key combination used to invoke the command from `jack`. This can either be a single lowercase letter, or prefixed with "C-" for a "control" modifer key, or "S-" for a "shift" modifier key. Some key combinations are reserved by `jack`.

The given value must validate with this reglar expression:

```js
const KEY_REGEX = /^([CS]-)?[a-z]$/;
```

It also must not be one of `jack`'s reserved keys:

```js
const RESERVED_KEYS = [...'bfjkmnoqrxy?'.split(''), 'C-c', 'S-n'];

b
f
j
k
m
n
o
q
r
x
y
?
C-c
S-n
```

### **onErrorCommand (Optional)**

**Type**: String

**Default**: `null`

**Description**: A command to run if there is an error with the main command. This is not usually necessary, but can be useful for cleaning up after a command that leaves garbage if it fails, such as a `git cherry-pick` or `git rebase`.

### **refreshOnComplete (Optional)**

**Type**: Boolean

**Default**: `false`

**Description**: Whether or not to refresh the log after the command has completed. This is useful for operations that change the log like `git rebase` or `git cherry-pick`.

## Placeholder tokens

`jack` defines several placeholder tokens that may be used in the [`command`](#command-required) property of a Command object. These will be substituted with information from the currently selected commit.

The placeholder tokens are delimited by `[%` and `%]`.

Example usage:

`"git -p diff [%SHA_RANGE%] --patch --stat-width=1000"`

### **COMMIT_MESSAGE**

Will be replaced by the commit message of the currently selected commit

### **SHA_RANGE**

Will always be replaced by a revision range, even if there is no marked commit. Commands such as `git diff` or `git difftool` require this to show the changes for just a single commit.

Example replacement values:

-   Single Commit: `4a22d67^..4a22d67`
-   With Marked Commit: `9103ae0^..4a22d67`

### **SHA_SINGLE_OR_RANGE**

Will be replaced by either a single commit SHA or a revision range if there is a marked commit.

Example replacement values:

-   Single Commit: `4a22d67`
-   With Marked Commit: `9103ae0^..4a22d67`

### **SHA_SINGLE**

Will be replaced by the currently selected commit SHA.

Example replacement values:

-   Single Commit: `4a22d67`
-   With Marked Commit: `4a22d67`

## Environment variables

### JACK_CLI_CONFIG_FILE_PATH

```shell
JACK_CLI_CONFIG_FILE_PATH="/users/username/path/to/custom-jack-config.json"
```

If you would like to use `jack` with different configuration files for different shell user logins, you can point to a custom json file by setting the JACK_CLI_CONFIG_FILE_PATH environment variable. If the file doesn't exist, `jack` will create it when it first starts up.

---

<!-- markdownlint-disable no-trailing-punctuation -->

## Miscellaneous

### **Why does the `foreground` option for my custom command not work?**

If the `foreground` property is set to true in one of your custom Command objects, you may run into one or more issues:

1. The process will just quit immediately and return you to the list.
2. The output will look garbled.

To fix these issues, you may need to configure your pager. For example, if your pager is `less`, try setting one of these environment variable:

```shell
export LESS=-r

export LESS=-R
```

Unfortunately this is not a guaranteed fix, and `jack` does not work properly in all terminals right now. If you come across a problem, please file an issue at [jack-cli/issues](https://github.com/drewbrokke/jack-cli/issues).

### **iTerm drag and drop is potentially dangerous while using `jack`**

If you are using iTerm, you may want to consider turning off selection drag-and-drop while using `jack`. If you accidentally select text and drag and drop it into an active `jack` process, `jack` will interpret _every single character_ in the selected text as a keystroke. If you have custom commands registered that can make changes of any kind, they may accidentally be triggered.

To turn this off in iTerm, go to:

Preferences > Advanced > "To drag images or select text, you must hold ⌘. This prevents accidental drags."

Set this value to "Yes".
