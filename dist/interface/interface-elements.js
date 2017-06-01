"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Blessed = require("blessed");
function constructProgressText(index = 0, total = 0) {
    return `Line ${index + 1}/${total}`;
}
exports.constructProgressText = constructProgressText;
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
function getScreenElement() {
    const screen = Blessed.screen({
        smartCSR: true,
    });
    screen.key(['C-c', 'q', 'escape'], () => process.exit(0));
    return screen;
}
exports.getScreenElement = getScreenElement;
function getTextElement(content) {
    return Blessed.text({
        border: 'line',
        content,
        fill: true,
        right: 0,
        shrink: true,
        top: 0,
    });
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
