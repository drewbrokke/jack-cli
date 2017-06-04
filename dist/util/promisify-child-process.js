"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function promisifyChildProcess(childProcess) {
    return new Promise((resolve, reject) => {
        let dataString = '';
        let errorString = '';
        childProcess.stdout.setEncoding('utf8');
        childProcess.stderr.setEncoding('utf8');
        childProcess.stdout.on('data', (data) => dataString += data);
        childProcess.stderr.on('data', (data) => errorString += data);
        childProcess.on('close', (code) => {
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
