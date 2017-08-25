export const helpText = `
{center}{bold}----- General -----{/bold}{/center}

{bold}Essentials:{/bold}
Navigate between commits                      j/k | down/up
Jump a number of commits                      (number) then j/k | down/up
"Quick Look" a commit's contents (toggle)     Space | Enter
Exit {bold}jack{/bold}                                     q | esc | ctrl-c
Show/hide help dialog                         ?

{bold}Viewing Changes:{/bold}
* Show diff                                                  d
* Show name-only diff (changed file paths)                   n
* Generate a diff file and open it in the default editor     e
* Open changed files in default editor                       o
Mark/unmark a commit                                         x

{bold}Acting on the branch:{/bold}
Cherry-pick commit to current branch       shift-c
Interactive rebase from current commit     shift-i

{bold}Copying to clipboard:{/bold}
Copy commit message     m
Copy commit SHA         y

{center}{bold}----- List View -----{/bold}{/center}

{bold}Navigating:{/bold}
Navigate between commits     j/k | down/up
Jump a number of commits     (number) then j/k | down/up
Page down/up                 f/b | Page Down/Page Up

{center}{bold}----- Commit View -----{/bold}{/center}

{bold}Moving between commits:{/bold}
View previous commit (in history)     shift-down | shift-j | right
View next commit (in history)         shift-up | shift-k | left

{bold}Navigating:{/bold}
Navigate down/up               j/k | down/up
Scroll down/up half screen     ctrl-d/ctrl-u
Scroll down/up full screen     ctrl-f/ctrl-b
Scroll to top/bottom           g/shift-g
`;
