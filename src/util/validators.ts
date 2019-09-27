import { Command } from './commands-def';

type CommandValidator = (commandOptions: Command) => void;

const KEY_REGEX = /^([CS]-)?[a-z]$/;
const RESERVED_KEYS = [...'bfjkmnoqrxy?'.split(''), 'C-c', 'S-n'];

const validateCommandProperty: CommandValidator = ({ command }) => {
	if (!command) {
		throw new Error(`Missing required property "command".`);
	}

	if (typeof command !== 'string') {
		throw new Error(`Property "command" must be a string.`);
	}

	const invalidTokenIndex = command.search(/\[% [^\%]+ %\]/g);

	if (invalidTokenIndex !== -1) {
		const invalidTokenString = command.slice(
			invalidTokenIndex,
			command.indexOf('%]', invalidTokenIndex) + 2,
		);

		throw new Error(
			`Invalid token ${invalidTokenString} in command: "${command}"

Use ${invalidTokenString.replace(/ /g, '')} instead.`,
		);
	}
};

const validateCommandArrayProperty: CommandValidator = ({ commandArray }) => {
	if (commandArray) {
		throw new Error(
			`Property 'commandArray' is deprecated. Use 'command' instead:

    "command": "${commandArray.join(' ')}"`,
		);
	}
};

const validateDescriptionProperty: CommandValidator = ({ description }) => {
	if (!description) {
		throw new Error(`Missing required property "description".`);
	}

	if (typeof description !== 'string') {
		throw new Error(`Property "description" must be a string.`);
	}
};

const validateKeyProperty: CommandValidator = ({ key }) => {
	if (!key) {
		throw new Error(`Missing required property "key".`);
	}

	if (typeof key !== 'string') {
		throw new Error(`Property "key" must be a string.`);
	}

	if (!KEY_REGEX.test(key)) {
		throw new Error(
			`Property "key" must match against the regex "${KEY_REGEX}"`,
		);
	}

	if (RESERVED_KEYS.includes(key)) {
		throw new Error(
			// tslint:disable-next-line:max-line-length
			`The key combination "${key}" is reserved. Here is the list of reserved key combinations: ${RESERVED_KEYS.join(
				' ',
			)}`,
		);
	}
};

const validateForegroundProperty: CommandValidator = ({ foreground }) => {
	if (foreground && typeof foreground !== 'boolean') {
		throw new Error('Property "foreground" must be a boolean.');
	}
};

const validateOnErrorCommandProperty: CommandValidator = ({
	onErrorCommand,
}) => {
	if (onErrorCommand && typeof onErrorCommand !== 'string') {
		throw new Error('Property "onErrorCommand" must be a string');
	}
};

const validateRefreshOnCompleteProperty: CommandValidator = ({
	refreshOnComplete,
}) => {
	if (refreshOnComplete && typeof refreshOnComplete !== 'boolean') {
		throw new Error('Property "refreshOnComplete" must be a boolean.');
	}
};

const VALIDATORS = [
	validateCommandProperty,
	validateCommandArrayProperty,
	validateDescriptionProperty,
	validateKeyProperty,
	validateForegroundProperty,
	validateOnErrorCommandProperty,
	validateRefreshOnCompleteProperty,
];

export const validateCommand = (command: Command): string[] => {
	const commandErrors: string[] = [];

	for (const validator of VALIDATORS) {
		try {
			validator(command);
		} catch (error) {
			commandErrors.push(error.message);
		}
	}

	return commandErrors;
};
