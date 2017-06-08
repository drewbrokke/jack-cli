import { spawn } from 'child_process';

import { decrementIndex, incrementIndex, viewList } from '../redux/action-creators';
import { store } from '../redux/store';
import { ScrollableTextElement } from '../types/types';
import { promisifyChildProcess } from '../util/promisify-child-process';
import { getScrollableTextElement } from './interface-elements';

let commitElement: ScrollableTextElement;

export function getCommitElement(): ScrollableTextElement {
	if (commitElement) {
		return commitElement;
	}

	commitElement = getScrollableTextElement({
		bottom: 0,
		clickable: true,
		keys: true,
		left: 0,
		mouse: true,
		right: 0,
		scrollable: true,
		scrollbar: true,
		top: 0,
		vi: true,
	});

	commitElement.key(['right', 'S-down', 'S-j'], () => store.dispatch(incrementIndex()));
	commitElement.key(['left', 'S-k', 'S-up'], () => store.dispatch(decrementIndex()));
	commitElement.key(['enter', 'space'], () => store.dispatch(viewList()));

	commitElement.focus();

	store.subscribe(updateCommitElement());

	return commitElement;
}

function updateCommitElement() {
	let lastState = store.getState();

	const commitContentMap: Map<string, string> = new Map();

	return () => {
		const state = store.getState();

		const {SHA, view} = state;

		const isCommitView: boolean = view === 'COMMIT';

		// Do render checks here

		if (isCommitView && commitElement.hidden) {
			commitElement.show();
			commitElement.focus();
		} else if (view === 'LIST' && commitElement.visible) {
			commitElement.hide();
		}

		if (isCommitView) {
			const commitContent: string | undefined = commitContentMap.get(SHA);

			if (!commitContent) {
				promisifyChildProcess(spawn('git', [ 'show', '--patch-with-stat', '--color', SHA ]))
					.then((commitContentResult: string) => {
						commitContentMap.set(SHA, commitContentResult);

						commitElement.setContent(commitContentResult);

						commitElement.scrollTo(0);

						commitElement.screen.render();
					});

			} else if (commitContent !== commitElement.content) {
				commitElement.setContent(commitContent);

				commitElement.scrollTo(0);
			}
		}

		lastState = state;

		commitElement.screen.render();
	};
}
