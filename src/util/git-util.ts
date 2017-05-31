import { ChildProcess, spawn, spawnSync, SpawnSyncReturns } from 'child_process';

export const COMMIT_ELEMENT_SEPARATOR: string = '{%SEPARATOR%}';

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
