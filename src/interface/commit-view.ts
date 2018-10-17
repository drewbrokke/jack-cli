import { updateIndex, updateView } from '../redux/action-creators';
import { doSubscribe, store } from '../redux/store';
import {
	BoxElement,
	StateProperty,
	UpdateFunction,
	View,
} from '../types/types';
import { gitShow } from '../util/git-util';
import { getBoxElement } from './interface-elements';
import { notifyWarning } from './notification';

export const getCommitElement = (): BoxElement => {
	const commitElement: BoxElement = getBoxElement({
		alwaysScroll: true,
		bottom: 0,
		keys: true,
		left: 0,
		name: 'commitContentContainer',
		right: 0,
		scrollable: true,
		top: 0,
		vi: true,
	});

	commitElement.key(['f', 'pagedown'], () => {
		commitElement.scroll(+commitElement.height);
		commitElement.screen.render();
	});
	commitElement.key(['b', 'pageup'], () => {
		commitElement.scroll(-commitElement.height);
		commitElement.screen.render();
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

	doSubscribe(
		[StateProperty.SHA, StateProperty.view],
		commitElement,
		updateCommitElement,
	);

	return commitElement;
};

const updateCommitElement: UpdateFunction<BoxElement> = async ({
	element: commitElement,
	state,
}) => {
	const { SHA, view } = state;

	if (view !== View.COMMIT) {
		commitElement.content = '';

		return false;
	}

	try {
		const commitContent = await gitShow(SHA);

		commitElement.setContent(commitContent);

		commitElement.scrollTo(0);

		return true;
	} catch (error) {
		notifyWarning(`Couldn't retrieve commit content for ${SHA}`);
	}

	return false;
};
