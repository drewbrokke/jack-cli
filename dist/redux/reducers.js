"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMIT_SHA_REGEX = new RegExp(/[0-9a-f]{7,40}\b/);
function reducer(state, action) {
    const currentIndex = state.index;
    const currentCommits = state.commits;
    const currentSHA = state.SHA;
    switch (action.type) {
        case 'ADD_COMMITS':
            const newCommits = typeof action.payload === 'string'
                ? Array.of(action.payload)
                : action.payload;
            const commits = [...currentCommits, ...newCommits];
            let SHA = currentSHA;
            if (!SHA) {
                SHA = getSHA(getNextValidIndex(currentIndex, currentIndex, commits), commits, SHA);
            }
            return Object.assign({}, state, { SHA,
                commits });
        case 'DECREMENT_INDEX':
            const previousValidIndex = getPreviousValidIndex(currentIndex - 1, currentIndex, currentCommits);
            return Object.assign({}, state, { SHA: getSHA(previousValidIndex, currentCommits, currentSHA), index: previousValidIndex });
        case 'INCREMENT_INDEX':
            const nextValidIndex = getNextValidIndex(currentIndex + 1, currentIndex, currentCommits);
            return Object.assign({}, state, { SHA: getSHA(nextValidIndex, currentCommits, currentSHA), index: nextValidIndex });
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
    if (exports.COMMIT_SHA_REGEX.test(commits[index])) {
        return index;
    }
    return getNextValidIndex(index + 1, prevValidIndex, commits);
}
function getPreviousValidIndex(index, prevValidIndex, commits) {
    if (index < 0) {
        return prevValidIndex;
    }
    if (exports.COMMIT_SHA_REGEX.test(commits[index])) {
        return index;
    }
    return getPreviousValidIndex(index - 1, prevValidIndex, commits);
}
function getSHA(index, commits, currentSHA) {
    const matches = exports.COMMIT_SHA_REGEX.exec(commits[index]);
    if (!matches) {
        return currentSHA;
    }
    const sha = matches[0];
    if (sha) {
        return sha;
    }
    return currentSHA;
}
