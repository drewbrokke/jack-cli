"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_elements_1 = require("./interface-elements");
function getScreen() {
    const screen = interface_elements_1.getScreenElement({
        smartCSR: true,
    });
    screen.key(['C-c', 'q', 'escape'], () => process.exit(0));
    return screen;
}
exports.getScreen = getScreen;
