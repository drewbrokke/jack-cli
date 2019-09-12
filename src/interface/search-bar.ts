import * as Blessed from 'blessed';

export const getSearchInput = (valueCallback: (value: string) => void) => {
	const input = Blessed.textarea({
		border: { fg: 3, type: 'line' },
		bottom: 0,
		height: 3,
		inputOnFocus: true,
		label: '/ Search:',
		name: 'searchInput',
		padding: {
			left: 1,
		},
		width: '100%',
	});

	input.onceKey('enter', () => {
		valueCallback(input.value.trim());

		input.submit();
	});

	input.on('action', () => {
		input.destroy();
		input.screen.render();
	});

	return input;
};
