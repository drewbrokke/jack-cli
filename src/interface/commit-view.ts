import { spawn } from 'child_process';

import { decrementIndex, incrementIndex, viewList } from '../redux/action-creators';
import { store } from '../redux/store';
import { KeyEvent, ScrollableTextElement } from '../types/types';
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

	const handleKeypressFn = (_ch: string, key: KeyEvent) => {
		switch (key.name) {
			case 'down':
			case 'j':
			case 'right':
				if (key.shift || key.name === 'right') {
					store.dispatch(incrementIndex());
				}

				break;

			case 'k':
			case 'left':
			case 'up':
				if (key.shift || key.name === 'left') {
					store.dispatch(decrementIndex());
				}

				break;

			case 'enter':
			case 'space':
				store.dispatch(viewList());

				break;

			default: break;
		}
	};

	commitElement.on('keypress', handleKeypressFn);

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
				promisifyChildProcess(spawn('git', [ 'show', '--color', SHA ]))
					.then((commitContentResult: string) => {
						commitContentMap.set(SHA, commitContentResult);

						commitElement.setContent(commitContentResult);

						commitElement.screen.render();
					});

			} else {
				commitElement.setContent(commitContent);
			}
		}

		lastState = state;

		commitElement.screen.render();
	};
}
