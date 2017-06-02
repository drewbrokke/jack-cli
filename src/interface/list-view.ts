import { decrementIndex, incrementIndex, viewCommit } from '../redux/action-creators';
import { store } from '../redux/store';
import { IListElement, KeyEvent } from '../types/types';
import { getListElement } from './interface-elements';

export function getCommitListElement(): IListElement {
	const list: IListElement = getListElement({
		bottom: 0,
		left: 0,
		mouse: true,
		right: 0,
		style: {
			selected: {
				bg: '#555',
			},
		},
		top: 0,
	});

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
				store.dispatch(viewCommit());

				break;

			default: break;
		}
	};

	list.on('keypress', handleKeypressFn);

	list.focus();

	return list;
}
