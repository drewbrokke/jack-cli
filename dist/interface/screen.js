"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("../redux/store");
var commit_view_1 = require("./commit-view");
var help_prompt_1 = require("./help-prompt");
var interface_elements_1 = require("./interface-elements");
var list_view_1 = require("./list-view");
var notification_1 = require("./notification");
var progress_indicator_1 = require("./progress-indicator");
var commands_1 = require("../util/commands");
function getScreen() {
    var screen = interface_elements_1.getScreenElement({
        autoPadding: true,
        smartCSR: true,
    });
    screen.key('?', notification_1.toggleHelp);
    screen.key('c', function () { return commands_1.cherryPickCommit(getSHA()); });
    screen.key('i', function () {
        return screen.exec('git', ['rebase', '-i', getSHA() + "^"], {}, function () { return process.exit(0); });
    });
    screen.key('o', function () { return commands_1.openFilesFromCommit(getSHA()); });
    screen.key('y', function () { return commands_1.copySHAToClipboard(getSHA()); });
    screen.key(['C-c', 'q', 'escape'], function () { return process.exit(0); });
    var commitElement = commit_view_1.getCommitElement();
    var commitListElement = list_view_1.getCommitListElement();
    screen.append(commitElement);
    screen.append(commitListElement);
    screen.append(help_prompt_1.getHelpPrompt());
    screen.append(progress_indicator_1.getProgressIndicator());
    screen.append(notification_1.getNotificationContainer());
    store_1.store.subscribe(updateView(screen, commitElement, commitListElement));
    return screen;
}
exports.getScreen = getScreen;
var updateView = function (screen, commitElement, commitListElement) { return function () {
    var state = store_1.store.getState();
    if (state.view === 'LIST' && screen.focused !== commitListElement) {
        commitElement.setBack();
        commitListElement.focus();
        return screen.render();
    }
    if (state.view === 'COMMIT' && screen.focused !== commitElement) {
        commitListElement.setBack();
        commitElement.focus();
        return screen.render();
    }
}; };
function getSHA() {
    return store_1.store.getState().SHA;
}
