"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function promisifyChildProcess(childProcess) {
    return new Promise(function (resolve, reject) {
        var dataString = '';
        var errorString = '';
        childProcess.stdout.setEncoding('utf8');
        childProcess.stderr.setEncoding('utf8');
        childProcess.stdout.on('data', function (data) { return dataString += data; });
        childProcess.stderr.on('data', function (data) { return errorString += data; });
        childProcess.on('close', function (code) {
            if (code === 0) {
                resolve(dataString.trim());
            }
            else {
                reject(errorString.trim());
            }
        });
    });
}
exports.promisifyChildProcess = promisifyChildProcess;
