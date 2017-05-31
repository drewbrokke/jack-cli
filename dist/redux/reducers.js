"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function reducer(state, action) {
    switch (action.type) {
        case 'ADD_COMMITS':
            const newCommits = typeof action.payload === 'string'
                ? Array.of(action.payload)
                : action.payload;
            const commits = [...state.commits, ...newCommits];
            return Object.assign({}, state, { commits });
        case 'DECREMENT_INDEX':
            return Object.assign({}, state, { index: getSafeIndex(state.index - 1, state.commits) });
        case 'INCREMENT_INDEX':
            return Object.assign({}, state, { index: getSafeIndex(state.index + 1, state.commits) });
        case 'TOGGLE_SPLIT':
            return Object.assign({}, state, { split: !state.split });
        case 'VIEW_COMMIT':
            return Object.assign({}, state, { view: 'COMMIT' });
        case 'VIEW_LIST':
            return Object.assign({}, state, { view: 'LIST' });
        default:
            return state;
    }
}
exports.reducer = reducer;
function getSafeIndex(index, commits) {
    if (index < 0) {
        return 0;
    }
    if (index >= commits.length) {
        return commits.length - 1;
    }
    return index;
}
