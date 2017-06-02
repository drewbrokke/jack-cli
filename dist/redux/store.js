"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Redux = require("redux");
const reducers_1 = require("./reducers");
const initialState = {
    SHA: '',
    commits: [],
    content: '',
    index: 0,
    notificationRequested: false,
    notificationText: '',
    split: false,
    view: 'LIST',
};
exports.store = Redux.createStore(reducers_1.reducer, initialState);
