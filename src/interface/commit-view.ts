import { decrementIndex, incrementIndex, viewList } from '../redux/action-creators';
import { store } from '../redux/store';
import { BoxElement, KeyEvent } from '../types/types';
import { getBoxElement } from './interface-elements';

export function getCommitElement(): BoxElement {
	let contentBox: BoxElement;

	const handleKeypressFn = (_ch: string, key: KeyEvent) => {
		switch (key.name) {
			case 'down':
			case 'j':
				store.dispatch(incrementIndex());

				break;

			case 'k':
			case 'up':
				store.dispatch(decrementIndex());

				break;

			case 'enter':
			case 'space':
				store.dispatch(viewList());

				break;

			default: break;
		}
	};

	contentBox = getBoxElement({}, handleKeypressFn);

	contentBox.focus();

	return contentBox;
}
