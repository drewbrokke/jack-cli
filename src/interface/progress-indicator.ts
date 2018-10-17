import { doSubscribe } from '../redux/store';
import { StateProperty, TextElement, UpdateFunction } from '../types/types';
import { getTextElement } from './interface-elements';

export const getProgressIndicator = (): TextElement => {
	const progressIndicator: TextElement = getTextElement({
		left: 0,
		name: 'progressIndicator',
	});

	doSubscribe(
		[StateProperty.index, StateProperty.indexesWithSHAs],
		progressIndicator,
		updateProgressIndicator,
	);

	return progressIndicator;
};

const updateProgressIndicator: UpdateFunction<TextElement> = async ({
	element: progressIndicator,
	state,
}) => {
	const { index, indexesWithSHAs } = state;

	progressIndicator.setText(
		constructProgressText(index, indexesWithSHAs.length),
	);

	return true;
};

const constructProgressText = (index: number = 0, total: number = 0): string =>
	`Commit ${index + 1}/${total}`;
