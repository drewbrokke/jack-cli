"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../redux/store");
const commit_view_1 = require("./commit-view");
const help_prompt_1 = require("./help-prompt");
const interface_elements_1 = require("./interface-elements");
const list_view_1 = require("./list-view");
const notification_1 = require("./notification");
const progress_indicator_1 = require("./progress-indicator");
const commands_1 = require("../util/commands");
let screen;
function getScreen() {
    if (screen) {
        return screen;
    }
    screen = interface_elements_1.getScreenElement({
        autoPadding: true,
        smartCSR: true,
    });
    screen.key('?', notification_1.toggleHelp);
    screen.key('c', () => commands_1.cherryPickCommit(getSHA()));
    screen.key('o', () => commands_1.openFilesFromCommit(getSHA()));
    screen.key('y', () => commands_1.copySHAToClipboard(getSHA()));
    screen.key(['C-c', 'q', 'escape'], () => process.exit(0));
    screen.append(commit_view_1.getCommitElement());
    screen.append(list_view_1.getCommitListElement());
    screen.append(help_prompt_1.getHelpPrompt());
    screen.append(progress_indicator_1.getProgressIndicator());
    screen.append(notification_1.getNotificationContainer());
    return screen;
}
exports.getScreen = getScreen;
function getSHA() {
    return store_1.store.getState().SHA;
}
