"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_creators_1 = require("../redux/action-creators");
const store_1 = require("../redux/store");
const interface_elements_1 = require("./interface-elements");
function getCommitListElement() {
    const list = interface_elements_1.getListElement({
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
    list.on('keypress', handleKeypressFn);
    list.focus();
    return list;
}
exports.getCommitListElement = getCommitListElement;
