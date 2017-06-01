"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
exports.COMMIT_ELEMENT_SEPARATOR = '{%SEPARATOR%}';
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
        '--abbrev-commit',
        '--date=relative',
        `--pretty=format:%h${exports.COMMIT_ELEMENT_SEPARATOR}%s${exports.COMMIT_ELEMENT_SEPARATOR}(%cr)${exports.COMMIT_ELEMENT_SEPARATOR}<%an>`,
        ...args,
    ]);
}
exports.getGitLogProcess = getGitLogProcess;
