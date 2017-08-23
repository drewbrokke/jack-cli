import { store } from '../redux/store';
import {
	TextElement,
 } from '../types/types';
import { getTextElement } from './interface-elements';

export function getProgressIndicator(): TextElement {
	const progressIndicator: TextElement =  getTextElement({
		left: 0,
	});

	store.subscribe(updateProgressIndicator(progressIndicator));

	return progressIndicator;
}

function updateProgressIndicator(progressIndicator) {
	let lastState = store.getState();

	return () => {
		const state = store.getState();

		const {index} = state;
		const {length} = state.indexesWithSHAs;

		if (length !== lastState.indexesWithSHAs.length ||
			index !== lastState.index) {

			progressIndicator.setText(constructProgressText(index, length));
		}

		lastState = state;

		progressIndicator.screen.render();
	};
}

function constructProgressText(
	index: number = 0, total: number = 0): string {

	return `Commit ${index + 1}/${total}`;
}
