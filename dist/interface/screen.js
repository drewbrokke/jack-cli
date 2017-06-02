"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clipboardy = require("clipboardy");
const action_creators_1 = require("../redux/action-creators");
const store_1 = require("../redux/store");
const interface_elements_1 = require("./interface-elements");
function getScreen() {
    const screen = interface_elements_1.getScreenElement({
        smartCSR: true,
    });
    screen.key('c', copySHAToClipboard);
    screen.key(['C-c', 'q', 'escape'], () => process.exit(0));
    return screen;
}
exports.getScreen = getScreen;
function copySHAToClipboard() {
    const { SHA } = store_1.store.getState();
    clipboardy.writeSync(SHA);
    store_1.store.dispatch(action_creators_1.notificationRequested(`Copied SHA to the clipboard: ${SHA}`));
}
