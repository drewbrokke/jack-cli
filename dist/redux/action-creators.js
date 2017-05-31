"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addCommits(commits) {
    return {
        payload: commits,
        type: 'ADD_COMMITS',
    };
}
exports.addCommits = addCommits;
function decrementIndex() {
    return {
        type: 'DECREMENT_INDEX',
    };
}
exports.decrementIndex = decrementIndex;
function incrementIndex() {
    return {
        type: 'INCREMENT_INDEX',
    };
}
exports.incrementIndex = incrementIndex;
function setCommitContent(content) {
    return {
        payload: content,
        type: 'SET_COMMIT_CONTENT',
    };
}
exports.setCommitContent = setCommitContent;
function viewCommit() {
    return {
        type: 'VIEW_COMMIT',
    };
}
exports.viewCommit = viewCommit;
function viewList() {
    return {
        type: 'VIEW_LIST',
    };
}
exports.viewList = viewList;
