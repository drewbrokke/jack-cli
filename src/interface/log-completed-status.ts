import { doSubscribe } from '../state/store';
import { Status, TextElement, UpdateFunction } from '../types/types';
import { getTextElement } from './interface-elements';

const RETRIEVING_TEXT = 'Retrieving git log...';

export const getLogCompletedStatus = (): TextElement => {
	const progressIndicator: TextElement = getTextElement({
		content: RETRIEVING_TEXT,
		left: 'center',
		name: 'statusIndicator',
		style: { bold: true, fg: 'yellow' },
	});

	doSubscribe(['status'], progressIndicator, updateProgressIndicator);

	return progressIndicator;
};

const statusInfo = {
	[Status.LOG_COMPLETED]: ['green', 'End of log'],
	[Status.LOG_STALE]: ['red', 'Log is stale, please refresh'],
	[Status.RETRIEVING_LOG]: ['yellow', RETRIEVING_TEXT],
};

const updateProgressIndicator: UpdateFunction<TextElement> = async ({
	element: progressIndicator,
	state,
}) => {
	const statusTuple = statusInfo[state.status];

	progressIndicator.style.fg = statusTuple[0];
	progressIndicator.setText(statusTuple[1]);

	return true;
};
