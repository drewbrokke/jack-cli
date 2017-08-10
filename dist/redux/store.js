"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Redux = require("redux");
var reducers_1 = require("./reducers");
var initialState = {
    SHA: '',
    index: 0,
    indexesWithSHAs: [0],
    lines: [],
    split: false,
    view: 'LIST',
};
exports.store = Redux.createStore(reducers_1.reducer, initialState);
