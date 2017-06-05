"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const action_creators_1 = require("../redux/action-creators");
const store_1 = require("../redux/store");
const promisify_child_process_1 = require("../util/promisify-child-process");
const interface_elements_1 = require("./interface-elements");
let commitElement;
function getCommitElement() {
    if (commitElement) {
        return commitElement;
    }
    commitElement = interface_elements_1.getScrollableTextElement({
        bottom: 0,
        clickable: true,
        keys: true,
        left: 0,
        mouse: true,
        right: 0,
        scrollable: true,
        scrollbar: true,
        top: 0,
        vi: true,
    });
    const handleKeypressFn = (_ch, key) => {
        switch (key.name) {
            case 'down':
            case 'j':
            case 'right':
                if (key.shift || key.name === 'right') {
                    store_1.store.dispatch(action_creators_1.incrementIndex());
                }
                break;
            case 'k':
            case 'left':
            case 'up':
                if (key.shift || key.name === 'left') {
                    store_1.store.dispatch(action_creators_1.decrementIndex());
                }
                break;
            case 'enter':
            case 'space':
                store_1.store.dispatch(action_creators_1.viewList());
                break;
            default: break;
        }
    };
    commitElement.on('keypress', handleKeypressFn);
    commitElement.focus();
    store_1.store.subscribe(updateCommitElement());
    return commitElement;
}
exports.getCommitElement = getCommitElement;
function updateCommitElement() {
    let lastState = store_1.store.getState();
    const commitContentMap = new Map();
    return () => {
        const state = store_1.store.getState();
        const { SHA, view } = state;
        const isCommitView = view === 'COMMIT';
        // Do render checks here
        if (isCommitView && commitElement.hidden) {
            commitElement.show();
            commitElement.focus();
        }
        else if (view === 'LIST' && commitElement.visible) {
            commitElement.hide();
        }
        if (isCommitView) {
            const commitContent = commitContentMap.get(SHA);
            if (!commitContent) {
                promisify_child_process_1.promisifyChildProcess(child_process_1.spawn('git', ['show', '--color', SHA]))
                    .then((commitContentResult) => {
                    commitContentMap.set(SHA, commitContentResult);
                    commitElement.setContent(commitContentResult);
                    commitElement.scrollTo(0);
                    commitElement.screen.render();
                });
            }
            else if (commitContent !== commitElement.content) {
                commitElement.setContent(commitContent);
                commitElement.scrollTo(0);
            }
        }
        lastState = state;
        commitElement.screen.render();
    };
}
