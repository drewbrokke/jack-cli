import { ChildProcess } from 'child_process';

export function promisifyChildProcess(childProcess: ChildProcess): Promise<any> {
	return new Promise((resolve, reject) => {
		let dataString = '';
		let errorString = '';

		childProcess.stdout.setEncoding('utf8');
		childProcess.stderr.setEncoding('utf8');

		childProcess.stdout.on('data', (data: string) => dataString += data);
		childProcess.stderr.on('data', (data: string) => errorString += data);

		childProcess.on('close', (code: number) => {
			if (code === 0) {
				resolve(dataString.trim());
			} else {
				reject(errorString.trim());
			}
		});
	});
}
