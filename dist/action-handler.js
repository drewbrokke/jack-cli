"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commit_view_1 = require("./commit-view");
const interface_elements_1 = require("./interface-elements");
const list_view_1 = require("./list-view");
function doAction(action, model) {
    const screen = model.screen || interface_elements_1.getScreenElement();
    screen.data.commits = model.commits;
    screen.data.content = model.content || '';
    screen.data.index = model.index || 0;
    switch (action) {
        case 0 /* RENDER_COMMIT */:
            screen.children.forEach((item) => item.destroy());
            commit_view_1.renderCommitView(screen);
            break;
        case 1 /* RENDER_LIST */:
            screen.children.forEach((item) => item.destroy());
            list_view_1.renderListView(screen);
            break;
        default: process.exit(1);
    }
    return screen;
}
exports.doAction = doAction;
