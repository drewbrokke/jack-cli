"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interface_elements_1 = require("./interface-elements");
function getFileSelectorElement(items) {
    var fileSelector = interface_elements_1.getListElement({
        border: 'line',
        items: items,
        keys: true,
        mouse: true,
        position: {
            bottom: 1,
            left: 1,
            right: 1,
            top: 1,
        },
        shrink: true,
        style: {
            selected: {
                bg: '#555',
            },
        },
        vi: true,
    });
    fileSelector.focus();
    return fileSelector;
}
exports.getFileSelectorElement = getFileSelectorElement;
