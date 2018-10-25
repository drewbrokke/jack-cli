import { ICommand } from './commands-def';

type CommandValidator = (commandOptions: ICommand) => void;

const KEY_REGEX = /^([CS]-)?[a-z]$/;
const RESERVED_KEYS = [...'bfgjkmoqrxy?'.split(''), 'C-c', 'S-j', 'S-k'];

export class ValidatorError extends Error {
	public commandOptions: ICommand;

	constructor(message: string, commandOptions: ICommand) {
		super(message);

		this.commandOptions = commandOptions;
	}
}

const validateCommandProperty: CommandValidator = (
	commandOptions: ICommand,
) => {
	if (!commandOptions.command) {
		throw new ValidatorError(
			`Command object is missing the required property "command".`,
			commandOptions,
		);
	}

	if (typeof commandOptions.command !== 'string') {
		throw new ValidatorError(
			`The property "command" must be a string.`,
			commandOptions,
		);
	}
};

const validateDescriptionProperty: CommandValidator = (
	commandOptions: ICommand,
) => {
	if (!commandOptions.description) {
		throw new ValidatorError(
			`Command object is missing the required property "description".`,
			commandOptions,
		);
	}

	if (typeof commandOptions.description !== 'string') {
		throw new ValidatorError(
			`The property "description" must be a string.`,
			commandOptions,
		);
	}
};
const validateKeyProperty: CommandValidator = (commandOptions) => {
	if (!commandOptions.key) {
		throw new ValidatorError(
			`Command object is missing the required property "key".`,
			commandOptions,
		);
	}

	if (typeof commandOptions.key !== 'string') {
		throw new ValidatorError(
			`The property "key" must be a string.`,
			commandOptions,
		);
	}

	if (!KEY_REGEX.test(commandOptions.key)) {
		throw new ValidatorError(
			`The property "key" must match against the regex "${KEY_REGEX}"`,
			commandOptions,
		);
	}

	if (RESERVED_KEYS.includes(commandOptions.key)) {
		throw new ValidatorError(
			// tslint:disable-next-line:max-line-length
			`The key combination "${
				commandOptions.key
			}" is reserved. Here is the list of reserved key combinations: ${RESERVED_KEYS.join(
				' ',
			)}`,
			commandOptions,
		);
	}
};

const validateForegroundProperty: CommandValidator = (commandOptions) => {
	if (
		commandOptions.foreground &&
		typeof commandOptions.foreground !== 'boolean'
	) {
		throw new ValidatorError(
			'The property "foreground" must be a boolean.',
			commandOptions,
		);
	}
};

const validateOnErrorCommandProperty: CommandValidator = (commandOptions) => {
	if (
		commandOptions.onErrorCommand &&
		typeof commandOptions.onErrorCommand !== 'string'
	) {
		throw new ValidatorError(
			'The property "onErrorCommand" must be a string',
			commandOptions,
		);
	}
};

const validateRefreshOnCompleteProperty: CommandValidator = (
	commandOptions,
) => {
	if (
		commandOptions.refreshOnComplete &&
		typeof commandOptions.refreshOnComplete !== 'boolean'
	) {
		throw new ValidatorError(
			'The property "refreshOnComplete" must be a boolean.',
			commandOptions,
		);
	}
};

export const VALIDATORS = [
	validateCommandProperty,
	validateDescriptionProperty,
	validateKeyProperty,
	validateForegroundProperty,
	validateOnErrorCommandProperty,
	validateRefreshOnCompleteProperty,
];
