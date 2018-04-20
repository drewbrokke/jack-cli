export const uniqBy = <T>(array: T[], propertyName: string): T[] => {
	const names: string[] = [];

	return array.filter((object: T) => {
		if (names.includes(object[propertyName])) {
			return false;
		}

		names.push(object[propertyName]);

		return true;
	});
};

export const uniqByLast = <T>(array: T[], propertyName: string): T[] =>
	uniqBy([...array].reverse(), propertyName).reverse();
