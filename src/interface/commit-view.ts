import { updateIndex, updateView } from '../redux/action-creators';
import { store } from '../redux/store';
import { ScrollableTextElement, View } from '../types/types';
import { gitShow } from '../util/git-util';
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

	commitElement.key(['right', 'S-down', 'S-j'], () =>
		store.dispatch(updateIndex(1)),
	);

	commitElement.key(['left', 'S-k', 'S-up'], () =>
		store.dispatch(updateIndex(-1)),
	);

	commitElement.key(['enter', 'space'], () =>
		store.dispatch(updateView(View.LIST)),
	);

	commitElement.focus();

	store.subscribe(updateCommitElement(commitElement));

	return commitElement;
};

const updateCommitElement = (commitElement) => {
	let lastState = store.getState();

	return async () => {
		const state = store.getState();

		const { SHA, view } = state;
		const { SHA: lastSHA, view: lastView } = lastState;

		lastState = state;

		try {
			if (view !== View.COMMIT) {
				commitElement.content = '';

				return;
			}

			if (SHA !== lastSHA || view !== lastView) {
				const commitContent = await gitShow(SHA);

				commitElement.setContent(commitContent);

				commitElement.scrollTo(0);

				commitElement.screen.render();
			}
		} catch (error) {
			notifyWarning(`Couldn't retrieve commit content for ${SHA}`);
		}
	};
};
