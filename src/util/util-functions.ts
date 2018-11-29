const CONST_DOUBLE_QUOTE = '"';
const CONST_SINGLE_QUOTE = "'";
const CONST_SPACE = ' ';

const matchChars = [CONST_SINGLE_QUOTE, CONST_DOUBLE_QUOTE];

export const stringToCommandArray = (s: string): string[] => {
	const retVal: string[] = [];

	let enclosingChar: string | null = null;
	let tempString: string = '';

	const arrayLength = s.length;

	for (let i = 0; i < arrayLength; i++) {
		const char = s[i];

		if (char === enclosingChar) {
			enclosingChar = null;

			continue;
		}

		if (!enclosingChar && matchChars.includes(char)) {
			enclosingChar = char;

			continue;
		}

		const isSpace = char === CONST_SPACE;

		if (!!enclosingChar || !isSpace) {
			tempString += char;
		}

		const isLastChar = arrayLength - 1 === i;

		const isSplittableSpace = isSpace && !enclosingChar;

		if ((isLastChar || isSplittableSpace) && tempString.length !== 0) {
			retVal.push(tempString);

			tempString = '';
		}
	}

	if (!!tempString) {
		retVal.push(tempString);
	}

	return retVal;
};

export const uniqBy = <T extends { [key: string]: any }>(
	arr: T[],
	keyPropertyName: string,
): T[] => {
	const keyProperties: any[] = [];

	return arr.filter((object: T) => {
		if (keyProperties.includes(object[keyPropertyName])) {
			return false;
		}

		keyProperties.push(object[keyPropertyName]);

		return true;
	});
};

export const uniqByLast = <T extends { [key: string]: any }>(
	arr: T[],
	keyPropertyName: string,
): T[] => uniqBy([...arr].reverse(), keyPropertyName).reverse();
