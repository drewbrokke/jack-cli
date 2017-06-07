export const helpText = `
Global Key Commands:
- Exit jack:                                q | esc | ctrl + c
- Show/hide this help dialog:               ?

- Cherry-pick commit to current branch:     c
- Open changed files in default editor:     o
- Copy current commit's SHA to clipboard:   y

Navigation Key Commands:

List view
- Select next item:                         down | j
- Select previous item:                     up | k
- Move by intervals (like Vim)              (number) then (up | down | j | k)
- Go to Commit View (git show the commit):  space | enter

Commit view
- View next commit:                         shift + down | shift + j | right
- View previous commit:                     shift + up | shift + k | left
- Return to List View:                      space | enter
- Navigating commit content:
    + Scroll up:                            up | k
    + Scroll down:                          down | j
    + Scroll up half screen:                ctrl + u
    + Scroll down half screen:              ctrl + d
    + Scroll up full screen:                ctrl + b
    + Scroll down full screen:              ctrl + f
    + Scroll to top:                        g
    + Scroll to bottom:                     shift + g
`;
