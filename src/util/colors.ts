import chalk from 'chalk';

export type ColorFn = (s: string) => string;

export const colors = {
	emphasis: chalk.bold,
	error: chalk.bold.red,
	info: chalk.bold.blue,
	searchHit: chalk.inverse,
	success: chalk.bold.green,
	warning: chalk.bold.yellow,
};
