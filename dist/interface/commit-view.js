"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var action_creators_1 = require("../redux/action-creators");
var store_1 = require("../redux/store");
var promisify_child_process_1 = require("../util/promisify-child-process");
var interface_elements_1 = require("./interface-elements");
function getCommitElement() {
    var commitElement = interface_elements_1.getScrollableTextElement({
        bottom: 1,
        clickable: true,
        keys: true,
        left: 0,
        mouse: true,
        right: 0,
        scrollable: true,
        top: 0,
        vi: true,
    });
    commitElement.key(['right', 'S-down', 'S-j'], function () { return store_1.store.dispatch(action_creators_1.incrementIndex()); });
    commitElement.key(['left', 'S-k', 'S-up'], function () { return store_1.store.dispatch(action_creators_1.decrementIndex()); });
    commitElement.key(['enter', 'space'], function () { return store_1.store.dispatch(action_creators_1.viewList()); });
    commitElement.focus();
    store_1.store.subscribe(updateCommitElement(commitElement));
    return commitElement;
}
exports.getCommitElement = getCommitElement;
function updateCommitElement(commitElement) {
    var lastState = store_1.store.getState();
    var commitContentMap = new Map();
    return function () {
        var state = store_1.store.getState();
        if (state.SHA === lastState.SHA && commitElement.content)
            return lastState = state;
        lastState = state;
        var SHA = state.SHA;
        if (commitContentMap.get(SHA)) {
            commitElement.setContent(commitContentMap.get(SHA));
            commitElement.scrollTo(0);
            return commitElement.screen.render();
        }
        return promisify_child_process_1.promisifyChildProcess(child_process_1.spawn('git', [
            'show',
            '--patch-with-stat',
            '--stat-width',
            '1000',
            '--color',
            SHA,
        ]))
            .then(function (commitContentResult) {
            commitContentMap.set(SHA, commitContentResult);
            commitElement.setContent(commitContentResult);
            commitElement.scrollTo(0);
            return commitElement.screen.render();
        });
    };
}
