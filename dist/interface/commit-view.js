"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_creators_1 = require("../redux/action-creators");
const store_1 = require("../redux/store");
const interface_elements_1 = require("./interface-elements");
function getCommitElement() {
    const contentBox = interface_elements_1.getScrollableTextElement({
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
    contentBox.on('keypress', handleKeypressFn);
    contentBox.focus();
    return contentBox;
}
exports.getCommitElement = getCommitElement;
