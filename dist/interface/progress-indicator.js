"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../redux/store");
const interface_elements_1 = require("./interface-elements");
let progressIndicator;
function getProgressIndicator() {
    if (progressIndicator) {
        return progressIndicator;
    }
    progressIndicator = interface_elements_1.getTextElement({
        border: 'line',
        fill: true,
        right: 0,
        shrink: true,
        top: 3,
    });
    store_1.store.subscribe(updateProgressIndicator());
    return progressIndicator;
}
exports.getProgressIndicator = getProgressIndicator;
function updateProgressIndicator() {
    let lastState = store_1.store.getState();
    return () => {
        const state = store_1.store.getState();
        const { index } = state;
        const { length } = state.commits;
        if (length !== lastState.commits.length ||
            index !== lastState.index) {
            progressIndicator.setText(constructProgressText(index, length));
        }
        lastState = state;
        progressIndicator.screen.render();
    };
}
function constructProgressText(index = 0, total = 0) {
    return `Line ${index + 1}/${total}`;
}
