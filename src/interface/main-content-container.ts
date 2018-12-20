import { doSubscribe } from '../state/store';
import { BoxElement, UpdateFunction, View } from '../types/types';
import { getCommitElement } from './commit-view';
import { getBoxElement } from './interface-elements';
import { getCommitListElement } from './list-view';

let mainContentContainer: BoxElement;

export const getMainContentContainer = (): BoxElement => {
	mainContentContainer = getBoxElement({
		bottom: 1,
		left: 0,
		name: 'mainContentContainer',
		right: 0,
		top: 0,
	});

	const commitElement = getCommitElement();
	const commitListElement = getCommitListElement();

	mainContentContainer.append(commitElement);
	mainContentContainer.append(commitListElement);

	doSubscribe(['view'], commitElement, updateView(View.COMMIT));
	doSubscribe(['view'], commitListElement, updateView(View.LIST));

	return mainContentContainer;
};

const updateView = (view: View): UpdateFunction<BoxElement> => async ({
	state,
	element,
}) => {
	if (state.view === view) {
		element.setFront();
		element.focus();

		return true;
	}

	return false;
};
