import { decrementIndex, incrementIndex, viewCommit } from '../redux/action-creators';
import { store } from '../redux/store';
import { IListElement, KeyEvent } from '../types/types';
import { getCommitListElement } from './interface-elements';

export function getListElement(): IListElement {
	let list: IListElement;

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

	list = getCommitListElement(handleKeypressFn);

	list.focus();

	return list;
}
