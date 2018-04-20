export const uniqBy = <T>(arr: T[], keyPropertyName: string): T[] => {
	const keyProperties: any[] = [];

	return arr.filter((object: T) => {
		if (keyProperties.includes(object[keyPropertyName])) {
			return false;
		}

		keyProperties.push(object[keyPropertyName]);

		return true;
	});
};

export const uniqByLast = <T>(arr: T[], keyPropertyName: string): T[] =>
	uniqBy([...arr].reverse(), keyPropertyName).reverse();
