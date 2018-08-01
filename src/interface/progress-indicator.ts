import { store } from '../redux/store';
import { TextElement } from '../types/types';
import { getTextElement } from './interface-elements';

export const getProgressIndicator = (): TextElement => {
	const progressIndicator: TextElement = getTextElement({
		left: 0,
	});

	store.subscribe(updateProgressIndicator(progressIndicator));

	return progressIndicator;
};

const updateProgressIndicator = (progressIndicator) => {
	let lastState = store.getState();

	return () => {
		const state = store.getState();

		const { index } = state;
		const { length } = state.indexesWithSHAs;

		if (
			length !== lastState.indexesWithSHAs.length ||
			index !== lastState.index
		) {
			progressIndicator.setText(constructProgressText(index, length));
		}

		lastState = state;

		progressIndicator.screen.render();
	};
};

const constructProgressText = (index: number = 0, total: number = 0): string =>
	`Commit ${index + 1}/${total}`;
