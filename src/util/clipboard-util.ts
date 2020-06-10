import { spawn } from 'child_process';
import { getCopyToClipboardCommandArgs } from './config-util';

const clipboardCommandArgs = getCopyToClipboardCommandArgs();

export const writeToClipboard = async (text: string): Promise<void> => {
	if (clipboardCommandArgs.length) {
		return await doWriteToClipboard(
			clipboardCommandArgs[0],
			clipboardCommandArgs.slice(1),
			text,
		);
	} else if (process.platform === 'darwin') {
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

		copyProcess.on('error', (error: Error) => {
			return reject(
				new Error(`There was a problem running process: ${command}
${error.message}`),
			);
		});

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
