"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_handler_1 = require("./action-handler");
const git_util_1 = require("./git-util");
const interface_elements_1 = require("./interface-elements");
const contentCache = new Map();
function renderCommitView(screen) {
    const { commits, content, index } = screen.data;
    const { length } = commits;
    let contentBox;
    let progressMarker;
    const handleDownOrUpKeys = (newIndex) => updateContent(newIndex, commits, screen);
    const handleKeypressFn = (_ch, key) => {
        switch (key.name) {
            case 'down':
            case 'j':
                handleDownOrUpKeys(index + 1);
                break;
            case 'k':
            case 'up':
                handleDownOrUpKeys(index - 1);
                break;
            case 'enter':
            case 'space':
                action_handler_1.doAction(1 /* RENDER_LIST */, { commits, content, index, screen });
                break;
            default: break;
        }
    };
    contentBox = interface_elements_1.getBoxElement({ content }, handleKeypressFn);
    progressMarker = interface_elements_1.getTextElement(interface_elements_1.constructProgressText(index, length));
    contentBox.append(progressMarker);
    contentBox.focus();
    screen.append(contentBox);
    screen.render();
}
exports.renderCommitView = renderCommitView;
async function updateContent(index, commits, screen) {
    let content;
    let sha;
    if (index < 0)
        return;
    if (index >= commits.length)
        return;
    sha = commits[index].slice(0, 12);
    content = contentCache.get(sha);
    if (!content) {
        content = await git_util_1.getCommitContent(sha);
        contentCache.set(sha, content);
    }
    action_handler_1.doAction(0 /* RENDER_COMMIT */, { commits, content, index, screen });
}
