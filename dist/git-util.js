"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
exports.COMMIT_ELEMENT_SEPARATOR = '{%SEPARATOR%}';
function getChildProcessContent(process) {
    process.stdout.setEncoding('utf8');
    let content = '';
    process.stdout.on('data', (data) => content += data);
    return new Promise((resolve, reject) => {
        process.on('close', (code) => {
            if (code === 0) {
                resolve(content);
            }
            else {
                reject(new Error(`Error code: ${code}`));
            }
        });
    });
}
function getCommitContent(sha) {
    const gitShowProcess = child_process_1.spawn('git', [
        'show',
        '--abbrev-commit',
        '--color',
        sha,
    ]);
    return getChildProcessContent(gitShowProcess);
}
exports.getCommitContent = getCommitContent;
function getGitLog(args) {
    const gitLogProcess = child_process_1.spawn('git', [
        'log',
        '--abbrev-commit',
        '--date=relative',
        `--pretty=format:%h ${exports.COMMIT_ELEMENT_SEPARATOR} %s ${exports.COMMIT_ELEMENT_SEPARATOR}(%cr) ${exports.COMMIT_ELEMENT_SEPARATOR}<%an>`,
        ...args,
    ]);
    return getChildProcessContent(gitLogProcess)
        .then((content) => content
        .split('\n').filter((item) => Boolean(item)));
}
exports.getGitLog = getGitLog;
