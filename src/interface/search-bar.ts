import * as Blessed from 'blessed';

export const getSearchInput = (valueCallback: (value: string) => void) => {
	const input = Blessed.textarea({
		bottom: 0,
		height: 1,
		inputOnFocus: true,
		label: 'search:',
		name: 'searchInput',
		padding: {
			left: 10,
		},
		right: 0,
		shrink: true,
		width: '100%',
		// keys: true,
		// vi: false,
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
