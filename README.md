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

#### The Essentials

Action | Key
------ | ---
Navigate between commits | `j` / `k` or `down` / `up`
Jump a number of commits | (`number`) then `j` / `k` or `down` / `up`
"Quick Look" a commit's contents (toggle) | `Space` or `Enter`
Exit **jack** | `q` or `esc` or `ctrl-c`
Show/hide help dialog | `?`

#### Global Actions

*Note:* The following commands marked with a **\*** can be performed on either a single commit or a range of commits.  If a commit is marked with the **x** key, then the subsequent diff command will be performed on the **commit range** between the current commit and the marked commit.

Action | Key
------ | ----
**Viewing Changes** |
**\*** Show diff | `d`
**\*** Show name-only diff (changed file paths) | `n`
**\*** Generate a diff file and open it in the default editor | `e`
**\*** Open changed files in default editor | `o`
Mark/unmark a commit | `x`
**Acting on the branch** |
Cherry-pick commit to current branch | `shift-c`
Interactive rebase from current commit | `shift-i`
**Copying to clipboard** |
Copy commit message | `m`
Copy commit SHA | `y`

#### List View

Action | Key
------ | ----
Navigate between commits | `j` / `k` or `down` / `up`
Jump a number of commits | (`number`) then `j` / `k` or `down` / `up`
Page down/up | `f` / `b` or `Page Down` / `Page Up`


#### Commit View

Action | Keys
------ | ----
**Moving between commits** |
View previous commit (in history) | `shift-down` or `shift-j` or `right`
View next commit (in history) | `shift-up` or `shift-k` or `left`
**Navigating** |
Navigate down/up | `j` / `k` or `down` / `up`
Scroll down/up half screen | `ctrl-d` / `ctrl-u`
Scroll down/up full screen | `ctrl-f` / `ctrl-b`
Scroll to top/bottom | `g` / `shift-g`
