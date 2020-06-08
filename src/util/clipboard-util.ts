import { spawn } from 'child_process';

export const writeToClipboard = async (text: string): Promise<void> => {
	if (process.platform === 'darwin') {
		return await doWriteToClipboard('pbcopy', [], text);
	} else {
		return await doWriteToClipboard('xsel', ['--input'], text);
	}
};

const doWriteToClipboard = async (
	command: string,
	args: string[],
	text: string,
): Promise<void> => {
	return new Promise((resolve, reject) => {
		const copyProcess = spawn(command, args);

		let errorString = '';

		copyProcess.stderr.on('data', (data: string) => (errorString += data));

		copyProcess.on('close', (code: number) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(errorString.trim()));
			}
		});

		copyProcess.stdin.write(text);
		copyProcess.stdin.end();
	});
};
