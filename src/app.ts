import { Action, doAction } from './action-handler';
import { getGitLog } from './git-util';

export function run(args: string[]): void {
	getGitLog(args)
		.then((commits: string[]) => {
			if (commits.length) {
				return Promise.resolve(doAction(Action.RENDER_LIST, {commits}));
			} else {
				return Promise.reject(new Error('No commits found...'));
			}
		})
		.catch((err: Error) => {
			process.stderr.write(err.message);

			process.exit(1);
		});
}
