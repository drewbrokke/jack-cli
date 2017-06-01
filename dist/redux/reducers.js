"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const git_util_1 = require("../util/git-util");
function reducer(state, action) {
    const currentIndex = state.index;
    const currentCommits = state.commits;
    switch (action.type) {
        case 'ADD_COMMITS':
            const newCommits = typeof action.payload === 'string'
                ? Array.of(action.payload)
                : action.payload;
            const commits = [...currentCommits, ...newCommits];
            return Object.assign({}, state, { commits });
        case 'DECREMENT_INDEX':
            return Object.assign({}, state, { index: getPreviousValidIndex(currentIndex - 1, currentIndex, currentCommits) });
        case 'INCREMENT_INDEX':
            return Object.assign({}, state, { index: getNextValidIndex(currentIndex + 1, currentIndex, currentCommits) });
        case 'VIEW_COMMIT':
            return Object.assign({}, state, { view: 'COMMIT' });
        case 'VIEW_LIST':
            return Object.assign({}, state, { view: 'LIST' });
        default:
            return state;
    }
}
exports.reducer = reducer;
function getNextValidIndex(index, prevValidIndex, commits) {
    if (index >= commits.length) {
        return prevValidIndex;
    }
    if (git_util_1.COMMIT_SHA_REGEX.test(commits[index])) {
        return index;
    }
    return getNextValidIndex(index + 1, prevValidIndex, commits);
}
function getPreviousValidIndex(index, prevValidIndex, commits) {
    if (index < 0) {
        return prevValidIndex;
    }
    if (git_util_1.COMMIT_SHA_REGEX.test(commits[index])) {
        return index;
    }
    return getPreviousValidIndex(index - 1, prevValidIndex, commits);
}
