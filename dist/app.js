"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const screen_1 = require("./interface/screen");
const action_creators_1 = require("./redux/action-creators");
const store_1 = require("./redux/store");
function run(args) {
    screen_1.getScreen().render();
    const gitLogProcess = child_process_1.spawn('git', [
        'log',
        '--color=always',
        ...args,
    ]);
    gitLogProcess.stdout.setEncoding('utf8');
    gitLogProcess.stdout.on('data', (data) => {
        store_1.store.dispatch(action_creators_1.addCommits(data.trim().split('\n')));
    });
}
exports.run = run;
function runFromPipedData() {
    console.log('From Piped');
}
exports.runFromPipedData = runFromPipedData;
