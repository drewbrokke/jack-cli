"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
exports.COMMIT_ELEMENT_SEPARATOR = '{%SEPARATOR%}';
exports.COMMIT_SHA_REGEX = new RegExp(/[0-9a-f]{7,40}\b/);
function getCommitContentSync(sha) {
    const gitShowProcess = child_process_1.spawnSync('git', [
        'show',
        '--abbrev-commit',
        '--color',
        sha,
    ], {
        encoding: 'utf8',
    });
    return gitShowProcess.output.join('\n');
}
exports.getCommitContentSync = getCommitContentSync;
function getGitLogProcess(args) {
    return child_process_1.spawn('git', [
        'log',
        '--color=always',
        ...args,
    ]);
}
exports.getGitLogProcess = getGitLogProcess;
