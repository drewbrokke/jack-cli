import { decrementIndex, incrementIndex, viewList } from '../redux/action-creators';
import { store } from '../redux/store';
import { KeyEvent, ScrollableTextElement } from '../types/types';
import { getCommitContentSync } from '../util/git-util';
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
			let content: string | undefined = commitContentMap.get(SHA);

			if (!content) {
				content = getCommitContentSync(SHA);

				commitContentMap.set(SHA, content);
			}

			commitElement.setContent(content);
		}

		lastState = state;

		commitElement.screen.render();
	};
}
