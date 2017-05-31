import { ChildProcess, spawn, spawnSync, SpawnSyncReturns } from 'child_process';

export const COMMIT_ELEMENT_SEPARATOR: string = '{%SEPARATOR%}';

function getChildProcessContent(process: ChildProcess): Promise<string> {
	process.stdout.setEncoding('utf8');

	let content: string = '';

	process.stdout.on('data', (data: string) => content += data);

	return new Promise((resolve, reject) => {
		process.on('close', (code: number) => {
			if (code === 0) {
				resolve(content);
			} else {
				reject(new Error(`Error code: ${code}`));
			}
		});
	});
}

export function getCommitContent(sha: string): Promise<string> {
	const gitShowProcess: ChildProcess = spawn(
		'git',
		[
			'show',
			'--abbrev-commit',
			'--color',
			sha,
		],
	);

	return getChildProcessContent(gitShowProcess);
}

export function getCommitContentSync(sha: string): string {
	const gitShowProcess: SpawnSyncReturns<string> = spawnSync(
		'git',
		[
			'show',
			'--abbrev-commit',
			'--color',
			sha,
		],
		{
			encoding: 'utf8',
		},
	);

	return gitShowProcess.output.join('\n');
}

export function getGitLog(args: string[]): Promise<string[]> {
	const gitLogProcess: ChildProcess = spawn(
		'git',
		[
			'log',
			'--abbrev-commit',
			'--date=relative',
			`--pretty=format:%h${COMMIT_ELEMENT_SEPARATOR}%s${COMMIT_ELEMENT_SEPARATOR}(%cr)${COMMIT_ELEMENT_SEPARATOR}<%an>`,
			...args,
		],
	);

	return getChildProcessContent(gitLogProcess)
		.then((content) => content
			.split('\n').filter((item: string) => Boolean(item)));
}

export function getGitLogProcess(args: string[]): ChildProcess {
	return spawn(
		'git',
		[
			'log',
			'--abbrev-commit',
			'--date=relative',
			`--pretty=format:%h${COMMIT_ELEMENT_SEPARATOR}%s${COMMIT_ELEMENT_SEPARATOR}(%cr)${COMMIT_ELEMENT_SEPARATOR}<%an>`,
			...args,
		],
	);
}
