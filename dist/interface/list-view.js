"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_creators_1 = require("../redux/action-creators");
const store_1 = require("../redux/store");
const interface_elements_1 = require("./interface-elements");
let commitListElement;
function getCommitListElement() {
    if (commitListElement) {
        return commitListElement;
    }
    commitListElement = interface_elements_1.getListElement({
        bottom: 0,
        left: 0,
        mouse: true,
        right: 0,
        style: {
            selected: {
                bg: '#555',
            },
        },
        top: 0,
    });
    const handleKeypressFn = (_ch, key) => {
        switch (key.name) {
            case 'down':
            case 'j':
                store_1.store.dispatch(action_creators_1.incrementIndex());
                break;
            case 'k':
            case 'up':
                store_1.store.dispatch(action_creators_1.decrementIndex());
                break;
            case 'enter':
            case 'space':
                store_1.store.dispatch(action_creators_1.viewCommit());
                break;
            default: break;
        }
    };
    commitListElement.on('keypress', handleKeypressFn);
    commitListElement.focus();
    store_1.store.subscribe(updateCommitListElement());
    return commitListElement;
}
exports.getCommitListElement = getCommitListElement;
function updateCommitListElement() {
    let lastState = store_1.store.getState();
    return () => {
        const state = store_1.store.getState();
        const { commits, index, view } = state;
        const isListView = view === 'LIST';
        if (isListView && commitListElement.hidden) {
            commitListElement.show();
            commitListElement.focus();
        }
        else if (view === 'COMMIT' && commitListElement.visible) {
            commitListElement.hide();
        }
        if (commits !== lastState.commits) {
            commitListElement.setItems(commits);
        }
        if (index !== lastState.index) {
            commitListElement.select(index);
        }
        lastState = state;
        commitListElement.screen.render();
    };
}
