"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Blessed = require("blessed");
function getBoxElement(options) {
    return Blessed.box(options);
}
exports.getBoxElement = getBoxElement;
function getListElement(options) {
    return Blessed.list(options);
}
exports.getListElement = getListElement;
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
