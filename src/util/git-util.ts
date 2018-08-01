import { getGitShowOptions } from './config-util';
import { spawnPromise } from './promisify-child-process';

export const gitCommitMessage = (SHA: string): Promise<string> =>
	spawnPromise('git', ['show', SHA, '-s', '--pretty=format:%s']);

export const gitDiff = (SHA1: string, SHA2: string): Promise<string> =>
	spawnPromise('git', [
		'diff',
		`${SHA1}^..${SHA2}`,
		'--patch',
		'--stat-width=1000',
	]);

export const gitDiffNameOnly = (SHA1: string, SHA2: string): Promise<string> =>
	spawnPromise('git', ['diff', `${SHA1}^..${SHA2}`, '--name-only']);

export const gitShow = (SHA: string): Promise<string> => {
	let commandArray = ['show', SHA];

	const gitShowOptions = getGitShowOptions();

	if (gitShowOptions) {
		commandArray = commandArray.concat(gitShowOptions);
	}

	return spawnPromise('git', commandArray);
};

export const gitTopLevel = (): Promise<string> =>
	spawnPromise('git', ['rev-parse', '--show-toplevel']);

export const sortSHAs = (SHA1: string, SHA2: string): Promise<string[]> =>
	spawnPromise('git', ['merge-base', '--is-ancestor', SHA1, SHA2])
		.then(() => Promise.resolve([SHA1, SHA2]))
		.catch(() => Promise.resolve([SHA2, SHA1]));
