import { updateIndex, updateView } from '../redux/action-creators';
import { store } from '../redux/store';
import { ScrollableTextElement, View } from '../types/types';
import { spawnPromise } from '../util/promisify-child-process';
import { getScrollableTextElement } from './interface-elements';
import { notifyWarning } from './notification';

export const getCommitElement = (): ScrollableTextElement => {
	const commitElement: ScrollableTextElement = getScrollableTextElement({
		bottom: 0,
		clickable: true,
		keys: true,
		left: 0,
		right: 0,
		scrollable: true,
		top: 0,
		vi: true,
	});

	commitElement.key(
		['right', 'S-down', 'S-j'],
		() => store.dispatch(updateIndex(1)));

	commitElement.key(
		['left', 'S-k', 'S-up'],
		() => store.dispatch(updateIndex(-1)));

	commitElement.key(
		['enter', 'space'],
		() => store.dispatch(updateView(View.LIST)));

	commitElement.focus();

	store.subscribe(updateCommitElement(commitElement));

	return commitElement;
};

const updateCommitElement = (commitElement) => {
	let lastState = store.getState();

	const commitContentMap: Map<string, string> = new Map();

	return () => {
		const state = store.getState();

		if (state.SHA === lastState.SHA &&
			commitElement.content) {

			return lastState = state;
		}

		lastState = state;

		const { SHA } = state;

		if (commitContentMap.get(SHA)) {
			commitElement.setContent(commitContentMap.get(SHA));

			commitElement.scrollTo(0);

			return commitElement.screen.render();
		}

		return spawnPromise(
			'git',
			['show', '--patch-with-stat', '--stat-width', '1000', '--color', SHA])
			.then((commitContentResult: string) => {
				commitContentMap.set(SHA, commitContentResult);

				commitElement.setContent(commitContentResult);

				commitElement.scrollTo(0);

				return commitElement.screen.render();
			})
			.catch((errorMessage) =>
				notifyWarning(
					`There was an issue getting the commit content for ${SHA}:

${errorMessage}`));
	};
};
