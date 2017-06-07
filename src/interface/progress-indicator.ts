import { store } from '../redux/store';
import {
	TextElement,
 } from '../types/types';
import { getTextElement } from './interface-elements';

let progressIndicator: TextElement;

export function getProgressIndicator(): TextElement {
	if (progressIndicator) {
		return progressIndicator;
	}

	progressIndicator =  getTextElement({
		border: 'line',
		fill: true,
		right: 0,
		shrink: true,
		top: 3,
	});

	store.subscribe(updateProgressIndicator());

	return progressIndicator;
}

function updateProgressIndicator() {
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
