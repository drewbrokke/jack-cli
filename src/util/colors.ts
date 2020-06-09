import * as kleur from 'kleur';

export type ColorFn = (s: string) => string;

export const colors = {
	emphasis: (s: string) => kleur.bold(s),
	error: (s: string) => kleur.bold().red(s),
	info: (s: string) => kleur.bold().blue(s),
	searchHit: (s: string) => kleur.inverse(s),
	success: (s: string) => kleur.bold().green(s),
	warning: (s: string) => kleur.bold().yellow(s),
};
