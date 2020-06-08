import * as c from 'ansi-colors';

export type ColorFn = (s: string) => string;

export const colors = {
	emphasis: (s: string) => c.bold(s),
	error: (s: string) => c.bold.red(s),
	info: (s: string) => c.bold.blue(s),
	searchHit: (s: string) => c.inverse(s),
	success: (s: string) => c.bold.green(s),
	warning: (s: string) => c.bold.yellow(s),
};
