import { store } from '../redux/store';
import { TextElement } from '../types/types';
import { getTextElement } from './interface-elements';

const RETRIEVING_TEXT = 'Retrieving git log...';

export const getLogCompletedStatus = (): TextElement => {
	const progressIndicator: TextElement = getTextElement({
		content: RETRIEVING_TEXT,
		left: 'center',
		style: { bold: true, fg: 'yellow' },
	});

	store.subscribe(updateProgressIndicator(progressIndicator));

	return progressIndicator;
};

const updateProgressIndicator = (progressIndicator) => {
	let { status: lastStatus } = store.getState();

	return () => {
		const { status } = store.getState();

		if (status === lastStatus) {
			return;
		}

		if (status === 'LOG_COMPLETED') {
			progressIndicator.setText('End of log');
			progressIndicator.style.fg = 'green';
		} else if (status === 'LOG_STALE') {
			progressIndicator.setText('Log is stale, please refresh');
			progressIndicator.style.fg = 'red';
		} else if (status === 'RETRIEVING_LOG') {
			progressIndicator.setText(RETRIEVING_TEXT);
			progressIndicator.style.fg = 'yellow';
		}

		progressIndicator.screen.render();

		lastStatus = status;
	};
};
