import { decrementIndex, incrementIndex, viewList } from '../redux/action-creators';
import { store } from '../redux/store';
import { KeyEvent, ScrollableTextElement } from '../types/types';
import { getScrollableTextElement } from './interface-elements';

export function getCommitElement(): ScrollableTextElement {
	const contentBox: ScrollableTextElement = getScrollableTextElement({
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

	contentBox.on('keypress', handleKeypressFn);

	contentBox.focus();

	return contentBox;
}
