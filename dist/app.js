"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var screen_1 = require("./interface/screen");
var action_creators_1 = require("./redux/action-creators");
var store_1 = require("./redux/store");
function run(args) {
    screen_1.getScreen().render();
    var gitLogProcess = child_process_1.spawn('git', [
        'log',
        '--color=always'
    ].concat(args));
    gitLogProcess.stdout.setEncoding('utf8');
    gitLogProcess.stdout.on('data', function (data) {
        store_1.store.dispatch(action_creators_1.addCommits(data.trim().split('\n')));
    });
}
exports.run = run;
function runFromPipedData() {
    process.stdout.write('Piping into jack is not currently supported.\n');
    process.stdout.write('If you would like to contribute or comment, please see the issue on GitHub at https://github.com/drewbrokke/jack/issues/9.\n');
    process.exit(1);
}
exports.runFromPipedData = runFromPipedData;
