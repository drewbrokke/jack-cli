import { Actions } from '../state/actions';
import { doSubscribe } from '../state/store';
import { BoxElement, UpdateFunction, View } from '../types/types';
import { gitShow } from '../util/git-util';
import { getBoxElement } from './interface-elements';
import { notifier } from './notification';

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
	commitElement.key(['right', 'S-down', 'S-j'], () => Actions.updateIndex(1));
	commitElement.key(['left', 'S-k', 'S-up'], () => Actions.updateIndex(-1));
	commitElement.key(['enter', 'space'], () => Actions.updateView(View.LIST));

	commitElement.focus();

	doSubscribe(['SHA', 'view'], commitElement, updateCommitElement);

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
		notifier.warn(`Couldn't retrieve commit content for ${SHA}`);
	}

	return false;
};
