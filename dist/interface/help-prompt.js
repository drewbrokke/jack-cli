"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_elements_1 = require("./interface-elements");
let helpPrompt;
function getHelpPrompt() {
    if (helpPrompt) {
        return helpPrompt;
    }
    helpPrompt = interface_elements_1.getTextElement({
        border: 'line',
        content: 'Press "?" to show/hide help.',
        fill: true,
        right: 0,
        shrink: true,
        top: 0,
    });
    return helpPrompt;
}
exports.getHelpPrompt = getHelpPrompt;
