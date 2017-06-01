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
jack 00ca1d8efd20^..head

jack -n 100
```

### List view
- **Select next item**: `down` / `j`
- **Select previous item**: `up` / `k`
- **Go to Commit View** (`git show` the commit):      `space` | `enter`

### Commit view
- **View next commit**: `shift + down` | `shift + j` | `right`
- **View previous commit**: `shift + up` | `shift + k` | `left`
- **Return to List View**: `space` | `enter`
- **Navigating commit content**: This uses the interface library's [built-in commands](https://github.com/chjj/blessed/blob/master/lib/widgets/scrollablebox.js#L120-L162).
    + **Scroll up**: `up` | `k`
    + **Scroll down**: `down` | `j`
    + **Scroll up half screen**: `ctrl + u`
    + **Scroll down half screen**: `ctrl + d`
    + **Scroll up full screen**: `ctrl + b`
    + **Scroll down full screen**: `ctrl + f`
    + **Scroll to top**: `g`
    + **Scroll to bottom**: `shift + g`

## Limitations
It's not currently recommended to use **jack** with really big logs (> 2000 commits), as performance starts to suffer in the list view with that many items.  This is mostly due to the interface itself, but we'll work to make it as performant as possible.  In the meantime, hopefully you're not in a situation where you have to review more than 2000 commits at a single time :)
