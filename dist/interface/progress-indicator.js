"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_elements_1 = require("./interface-elements");
function getProgressIndicator(content) {
    return interface_elements_1.getTextElement({
        border: 'line',
        content,
        fill: true,
        right: 0,
        shrink: true,
        top: 0,
    });
}
exports.getProgressIndicator = getProgressIndicator;
function constructProgressText(index = 0, total = 0) {
    return `Line ${index + 1}/${total}`;
}
exports.constructProgressText = constructProgressText;
