# jack
Chop through that Git log wicked fast

**jack** is an interactive drop-in replacement for `git log`.  It allows you to view a list of commits and "quick-look" their changes right from the command line.  `git log`'s filtering and logging flexibility is so much better than almost all GUI apps, so in most cases, this will be a much faster way to review a series of commits/changes.

## Installation
```
npm i -g jack-cli
```

## Usage
### Generating a list
Use normal `git log` syntax.  **jack** just calls `git log` and passes all arguments.
```
jack

jack --grep 'some commit message pattern'

jack 00ca1d8efd20^..head

jack -n 100
```

### Key Commands

Global Actions | Keys
-------------- | ----
Exit **jack** | `q` / `esc` / `ctrl + c`
Show/hide help dialog | `?`
Cherry-pick commit to current branch | `c`
Open changed files in default editor | `o`
Copy current commit's SHA to clipboard | `y`

List Navigation | Keys
--------------- | ----
Select next item | `down` / `j`
Select previous item | `up` / `k`
Move by intervals (like Vim) | `(number)`, then `up` / `down` / `j` / `k`
Page down | `f` or `Page Down`
Page up | `b` or `Page Up`
Go to Commit View (git show the commit) | `space` / `enter`

Commit View Navigation | Keys
---------------------- | ----
View next commit | `shift + down` / `shift + j` / `right`
View previous commit | `shift + up` / `shift + k` / `left`
Return to List View | `space` or `enter`
Scroll up | `up` | `k`
Scroll down | `down` | `j`
Scroll up half screen | `ctrl + u`
Scroll down half screen | `ctrl + d`
Scroll up full screen | `ctrl + b`
Scroll down full screen | `ctrl + f`
Scroll to top | `g`
Scroll to bottom | `shift + g`

