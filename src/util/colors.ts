import chalk from 'chalk';

export type ColorFn = (s: string) => string;

export const colors = {
	emphasis: (s: string) => chalk.bold(s),
	error: (s: string) => chalk.bold.red(s),
	info: (s: string) => chalk.bold.blue(s),
	searchHit: (s: string) => chalk.inverse(s),
	success: (s: string) => chalk.bold.green(s),
	warning: (s: string) => chalk.bold.yellow(s),
};
