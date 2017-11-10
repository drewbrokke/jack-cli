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
