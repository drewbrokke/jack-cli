"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Blessed = require("blessed");
function getCommitListElement(onKeyPressFn) {
    const list = getListElement();
    list.on('keypress', onKeyPressFn);
    return list;
}
exports.getCommitListElement = getCommitListElement;
function getScrollableTextElement(options) {
    return Blessed.scrollabletext(options);
}
exports.getScrollableTextElement = getScrollableTextElement;
function getScreenElement(options) {
    return Blessed.screen(options);
}
exports.getScreenElement = getScreenElement;
function getTextElement(options) {
    return Blessed.text(options);
}
exports.getTextElement = getTextElement;
/*
Helper Functions
*/
function getListElement() {
    const listBgColor = '#555';
    return Blessed.list({
        bottom: 0,
        left: 0,
        mouse: true,
        right: 0,
        style: {
            selected: {
                bg: listBgColor,
            },
        },
        tags: true,
        top: 0,
    });
}
