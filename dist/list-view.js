"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_handler_1 = require("./action-handler");
const git_util_1 = require("./git-util");
const interface_elements_1 = require("./interface-elements");
function renderListView(screen) {
    const { commits, index } = screen.data;
    let list;
    let progressMarker;
    const listLength = commits.length;
    async function listOnSelectFn(_item, newIndex) {
        const [sha] = commits[newIndex].split(git_util_1.COMMIT_ELEMENT_SEPARATOR);
        const content = await git_util_1.getCommitContent(sha);
        action_handler_1.doAction(0 /* RENDER_COMMIT */, { commits, content, index: newIndex, screen });
    }
    const handleKeypressFn = (_ch, key) => {
        switch (key.name) {
            case 'down':
            case 'j':
            case 'k':
            case 'up':
                progressMarker.setContent(interface_elements_1.constructProgressText(list.selected, listLength));
                screen.render();
                break;
            case 'space':
                if (list.enterSelected) {
                    list.enterSelected();
                }
                break;
            default: break;
        }
    };
    list = interface_elements_1.getCommitListElement(commits, listOnSelectFn, handleKeypressFn);
    progressMarker = interface_elements_1.getTextElement(interface_elements_1.constructProgressText(index, commits.length));
    list.append(progressMarker);
    list.select(index);
    list.focus();
    screen.append(list);
    screen.render();
}
exports.renderListView = renderListView;
