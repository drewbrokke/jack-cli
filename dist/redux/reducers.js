"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMIT_SHA_REGEX = new RegExp(/[0-9a-f]{7,40}\b/);
function reducer(state, action) {
    var currentIndex = state.index;
    var currentIndexesWithSHAs = state.indexesWithSHAs;
    var currentLines = state.lines;
    var currentSHA = state.SHA;
    switch (action.type) {
        case 'ADD_COMMITS':
            var newLines = typeof action.payload === 'string'
                ? Array.of(action.payload)
                : action.payload;
            var lines = currentLines.concat(newLines);
            var newIndexesWithSHAs = newLines
                .map(function (line, index) {
                if (exports.COMMIT_SHA_REGEX.test(line)) {
                    return index + currentLines.length;
                }
                return 0;
            })
                .filter(Boolean);
            var indexesWithSHAs = currentIndexesWithSHAs.concat(newIndexesWithSHAs);
            var SHA = currentSHA;
            if (!SHA) {
                SHA = getSHA(indexesWithSHAs[currentIndex], lines, SHA);
            }
            return __assign({}, state, { SHA: SHA,
                indexesWithSHAs: indexesWithSHAs,
                lines: lines });
        case 'DECREMENT_INDEX':
            var previousIndex = Math.max(currentIndex - action.payload, 0);
            return __assign({}, state, { SHA: getSHA(currentIndexesWithSHAs[previousIndex], currentLines, currentSHA), index: previousIndex });
        case 'INCREMENT_INDEX':
            var nextIndex = Math.min(currentIndex + action.payload, currentIndexesWithSHAs.length - 1);
            return __assign({}, state, { SHA: getSHA(currentIndexesWithSHAs[nextIndex], currentLines, currentSHA), index: nextIndex });
        case 'VIEW_COMMIT':
            return __assign({}, state, { view: 'COMMIT' });
        case 'VIEW_LIST':
            return __assign({}, state, { view: 'LIST' });
        default:
            return state;
    }
}
exports.reducer = reducer;
function getSHA(index, commits, currentSHA) {
    var matches = exports.COMMIT_SHA_REGEX.exec(commits[index]);
    if (!matches) {
        return currentSHA;
    }
    var sha = matches[0];
    if (sha) {
        return sha;
    }
    return currentSHA;
}
