"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_creators_1 = require("../redux/action-creators");
const store_1 = require("../redux/store");
const interface_elements_1 = require("./interface-elements");
function getCommitElement() {
    let contentBox;
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
                store_1.store.dispatch(action_creators_1.viewList());
                break;
            default: break;
        }
    };
    contentBox = interface_elements_1.getBoxElement({}, handleKeypressFn);
    contentBox.focus();
    return contentBox;
}
exports.getCommitElement = getCommitElement;
