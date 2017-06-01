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
Navigate through the list:  `down/up` or `j/k`

Go to Commit View (`git show` the commit):   `space` or `enter`

### Commit view
View next/previous commit:  `down/up` or `j/k`

Return to List View:        `space` or `enter`

## Limitations
It's not currently recommended to use **jack** with really big logs (> 2000 commits), as performance starts to suffer in the list view with that many items.  This is mostly due to the interface itself, but we'll work to make it as performant as possible.  In the meantime, hopefully you're not in a situation where you have to review more than 2000 commits at a single time :)
