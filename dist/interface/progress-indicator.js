"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("../redux/store");
var interface_elements_1 = require("./interface-elements");
function getProgressIndicator() {
    var progressIndicator = interface_elements_1.getTextElement({
        bg: '#006680',
        bottom: 0,
        height: 1,
        right: 0,
        shrink: true,
        width: '100%',
    });
    store_1.store.subscribe(updateProgressIndicator(progressIndicator));
    return progressIndicator;
}
exports.getProgressIndicator = getProgressIndicator;
function updateProgressIndicator(progressIndicator) {
    var lastState = store_1.store.getState();
    return function () {
        var state = store_1.store.getState();
        var index = state.index;
        var length = state.indexesWithSHAs.length;
        if (length !== lastState.indexesWithSHAs.length ||
            index !== lastState.index) {
            progressIndicator.setText(constructProgressText(index, length));
        }
        lastState = state;
        progressIndicator.screen.render();
    };
}
function constructProgressText(index, total) {
    if (index === void 0) { index = 0; }
    if (total === void 0) { total = 0; }
    return "Commit " + (index + 1) + "/" + total;
}
