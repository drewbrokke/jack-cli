"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Blessed = require("blessed");
const git_util_1 = require("./git-util");
function constructProgressText(index = 0, total = 0) {
    return `Commit ${total - index}/${total}`;
}
exports.constructProgressText = constructProgressText;
function getCommitListElement(items, onSelectFn, onKeyPressFn) {
    const list = getListElement();
    list.on('select', onSelectFn);
    list.on('keypress', onKeyPressFn);
    list.setItems(items.map(addColorsToItem));
    return list;
}
exports.getCommitListElement = getCommitListElement;
function getBoxElement({ top = 0, right = 0, bottom = 0, left = 0, content = '' }, onKeyFn) {
    const box = Blessed.box({
        bottom,
        content,
        left,
        mouse: true,
        right,
        scrollable: true,
        scrollbar: true,
        top,
    });
    box.on('keypress', onKeyFn);
    return box;
}
exports.getBoxElement = getBoxElement;
function getScreenElement() {
    const screen = Blessed.screen();
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
function addColorsToItem(item) {
    const [sha, message, time, author] = item.split(git_util_1.COMMIT_ELEMENT_SEPARATOR);
    return [
        '{red-fg}', sha,
        '{white-fg}', message,
        '{green-fg}', time,
        '{blue-fg}', author,
        '{/}',
    ].join('');
}
function getListElement() {
    const listBgColor = '#555';
    return Blessed.list({
        bottom: 0,
        keys: true,
        left: 0,
        mouse: true,
        right: 0,
        style: {
            item: {
                hover: {
                    bg: listBgColor,
                },
            },
            selected: {
                bg: listBgColor,
            },
        },
        tags: true,
        top: 0,
        vi: true,
    });
}
