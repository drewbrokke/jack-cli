"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interface_elements_1 = require("./interface-elements");
var statusBar;
function getStatusBar() {
    if (statusBar) {
        return statusBar;
    }
    statusBar = interface_elements_1.getBoxElement({
        bg: 'blue',
        bottom: 0,
        height: 1,
        left: 0,
        right: 0,
        tags: true,
    });
    statusBar.setText('{bold}Hello, Drew{/bold}');
    return statusBar;
}
exports.getStatusBar = getStatusBar;
