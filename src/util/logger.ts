import { colors } from './colors';

export interface Logger {
	error(message: string): void;
	info(message: string): void;
	log(message: string): void;
	success(message: string): void;
	warn(message: string): void;
}

export const logger: Logger = {
	error(message: string) {
		process.stderr.write(colors.error(message) + '\n');
	},
	info(message: string) {
		process.stdout.write(colors.info(message) + '\n');
	},
	log(message: string) {
		process.stdout.write(message + '\n');
	},
	success(message: string) {
		process.stdout.write(colors.success(message) + '\n');
	},
	warn(message: string) {
		process.stderr.write(colors.warning(message) + '\n');
	},
};
