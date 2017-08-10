"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var action_creators_1 = require("../redux/action-creators");
var store_1 = require("../redux/store");
var stash_1 = require("../util/stash");
var interface_elements_1 = require("./interface-elements");
var notification_1 = require("./notification");
var commitListElement;
var NAV_INTERVAL = 'NAV_INTERVAL';
function getCommitListElement() {
    if (commitListElement) {
        return commitListElement;
    }
    commitListElement = interface_elements_1.getListElement({
        bottom: 1,
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
    function doUpdateIndex(action) {
        var interval = 1;
        var intervalFromStash = stash_1.stash.get(NAV_INTERVAL);
        if (intervalFromStash) {
            interval = intervalFromStash;
        }
        store_1.store.dispatch(action(interval));
        if (intervalFromStash) {
            stash_1.stash.delete(NAV_INTERVAL);
            notification_1.notifyInfo("Movement interval reset.");
        }
    }
    commitListElement.key('1234567890'.split(''), function (keyName) {
        var newInterval = keyName;
        var intervalFromStash = stash_1.stash.get(NAV_INTERVAL);
        if (intervalFromStash) {
            newInterval = "" + intervalFromStash + newInterval;
        }
        stash_1.stash.set(NAV_INTERVAL, parseInt(newInterval, 10));
        notification_1.notifyInfo("Movement interval: " + newInterval);
    });
    commitListElement.key(['down', 'j'], function () { return doUpdateIndex(action_creators_1.incrementIndex); });
    commitListElement.key(['k', 'up'], function () { return doUpdateIndex(action_creators_1.decrementIndex); });
    commitListElement.key(['b', 'pageup'], function () { return store_1.store.dispatch(action_creators_1.decrementIndex(Number(commitListElement.height))); });
    commitListElement.key(['f', 'pagedown'], function () { return store_1.store.dispatch(action_creators_1.incrementIndex(Number(commitListElement.height))); });
    commitListElement.key('s', function () { return commitListElement.screen.spawn('git', ['show', '--patch-with-stat', store_1.store.getState().SHA], {}); });
    commitListElement.key(['enter', 'space'], function () { return store_1.store.dispatch(action_creators_1.viewCommit()); });
    commitListElement.focus();
    store_1.store.subscribe(updateCommitListElement());
    return commitListElement;
}
exports.getCommitListElement = getCommitListElement;
function updateCommitListElement() {
    var lastState = store_1.store.getState();
    return function () {
        var state = store_1.store.getState();
        var index = state.index, lines = state.lines;
        var listHeight = commitListElement.height;
        var lineIndex = state.indexesWithSHAs[index];
        var nextLine = state.lines[lineIndex];
        if (lines !== lastState.lines && commitListElement.children.length < listHeight) {
            commitListElement.setItems(lines.slice(lineIndex, lineIndex + listHeight));
        }
        if (index !== lastState.index && commitListElement.getItemIndex(nextLine) !== -1) {
            commitListElement.select(commitListElement.getItemIndex(nextLine));
        }
        else if (index > lastState.index) {
            var newLines = lines.slice(lineIndex - listHeight, lineIndex + 1);
            commitListElement.setItems(newLines);
            commitListElement.select(newLines.indexOf(nextLine));
        }
        else if (index < lastState.index) {
            var newLines = lines.slice(lineIndex, lineIndex + listHeight);
            commitListElement.setItems(newLines);
            commitListElement.select(newLines.indexOf(nextLine));
        }
        lastState = state;
        commitListElement.screen.render();
    };
}
