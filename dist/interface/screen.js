"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const clipboardy = require("clipboardy");
const opn = require("opn");
const path = require("path");
const action_creators_1 = require("../redux/action-creators");
const store_1 = require("../redux/store");
const interface_elements_1 = require("./interface-elements");
const REPO_TOP_LEVEL = child_process_1.spawnSync('git', ['rev-parse', '--show-toplevel']).stdout.toString().split('\n')[0];
function getScreen() {
    const screen = interface_elements_1.getScreenElement({
        autoPadding: true,
        smartCSR: true,
    });
    screen.key('c', copySHAToClipboard);
    screen.key('o', openFilesFromCommit);
    screen.key('p', cherryPickCommit);
    screen.key(['C-c', 'q', 'escape'], () => process.exit(0));
    return screen;
}
exports.getScreen = getScreen;
function cherryPickCommit() {
    const { SHA } = store_1.store.getState();
    const cherryPickSync = child_process_1.spawnSync('git', ['cherry-pick', SHA]);
    if (cherryPickSync.status !== 0) {
        store_1.store.dispatch(action_creators_1.notificationRequested(`Cherry-pick failed:\n\n${cherryPickSync.stderr.toString()}\n\nAborting cherry-pick.`));
        child_process_1.spawn('git', ['cherry-pick', '--abort']);
    }
    else {
        store_1.store.dispatch(action_creators_1.notificationRequested(`Successfully cherry-picked commit ${SHA} onto current branch.`));
    }
}
function copySHAToClipboard() {
    const { SHA } = store_1.store.getState();
    clipboardy.writeSync(SHA);
    store_1.store.dispatch(action_creators_1.notificationRequested(`Copied SHA to the clipboard: ${SHA}`));
}
function openFilesFromCommit() {
    const { SHA } = store_1.store.getState();
    child_process_1.exec(`git diff --name-only ${SHA}^..${SHA}`, (_error, stdout) => {
        const files = stdout.split('\n').filter(Boolean);
        files
            .map((file) => path.join(REPO_TOP_LEVEL, file))
            .forEach((file) => opn(file));
        store_1.store.dispatch(action_creators_1.notificationRequested(`Opening files:\n\n${files.join('\n')}`));
    });
}
