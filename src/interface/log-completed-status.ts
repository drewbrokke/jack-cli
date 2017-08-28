import { store } from '../redux/store';
import {
	TextElement,
 } from '../types/types';
import { getTextElement } from './interface-elements';

export const getLogCompletedStatus = (): TextElement => {
	const progressIndicator: TextElement =  getTextElement({
		content: 'Retrieving git log...',
		left: 'center',
		style: {
			bold: true,
			fg: 'yellow',
		},
	});

	store.subscribe(updateProgressIndicator(progressIndicator));

	return progressIndicator;
};

const updateProgressIndicator = (progressIndicator) => () => {
		if (store.getState().logCompleted) {
			progressIndicator.setText('End of log');
			progressIndicator.style.fg = 'green';

			progressIndicator.screen.render();
		}
};
