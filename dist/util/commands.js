"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const clipboardy = require("clipboardy");
const opn = require("opn");
const path = require("path");
const notification_1 = require("../interface/notification");
const promisify_child_process_1 = require("./promisify-child-process");
let REPO_TOP_LEVEL;
function cherryPickCommit(SHA) {
    promisify_child_process_1.promisifyChildProcess(child_process_1.spawn('git', ['cherry-pick', SHA]))
        .then(() => notification_1.notifySuccess(`Successfully cherry-picked commit ${SHA} onto current branch.`))
        .catch((errorMessage) => {
        notification_1.notifyError(`Cherry-pick failed:\n\n${errorMessage}\n\nAborting cherry-pick.`);
        child_process_1.spawn('git', ['cherry-pick', '--abort']);
    });
}
exports.cherryPickCommit = cherryPickCommit;
function copySHAToClipboard(SHA) {
    clipboardy.write(SHA)
        .then(() => notification_1.notifySuccess(`Copied SHA to the clipboard: ${SHA}`));
}
exports.copySHAToClipboard = copySHAToClipboard;
function openFilesFromCommit(SHA) {
    if (REPO_TOP_LEVEL) {
        doOpenFilesFromCommit(SHA, REPO_TOP_LEVEL);
    }
    else {
        promisify_child_process_1.promisifyChildProcess(child_process_1.spawn('git', ['rev-parse', '--show-toplevel']))
            .then((repoTopLevel) => {
            REPO_TOP_LEVEL = repoTopLevel;
            doOpenFilesFromCommit(SHA, repoTopLevel);
        })
            .catch(handleOpenFilesFromCommitError);
    }
}
exports.openFilesFromCommit = openFilesFromCommit;
// Helper functions
function doOpenFilesFromCommit(SHA, repoTopLevel) {
    promisify_child_process_1.promisifyChildProcess(child_process_1.spawn('git', ['diff', '--name-only', `${SHA}^..${SHA}`]))
        .then((filesString) => {
        const files = filesString.split('\n');
        files.map((file) => path.join(repoTopLevel, file)).forEach(opn);
        notification_1.notifyInfo(`Opening files:\n\n${filesString}`);
    })
        .catch(handleOpenFilesFromCommitError);
}
function handleOpenFilesFromCommitError(errorMessage) {
    notification_1.notifyError(`Could not open files:\n\n${errorMessage}`);
}
