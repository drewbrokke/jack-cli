import { decrementIndex, incrementIndex, viewCommit } from '../redux/action-creators';
import { store } from '../redux/store';
import { IListElement, KeyEvent, TextElement } from '../types/types';
import { addColorsToItem, constructProgressText, getCommitListElement, getTextElement } from './interface-elements';

export function getListElement(commits: string[], index: number): IListElement {
	let list: IListElement;
	let progressMarker: TextElement;

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

	list = getCommitListElement(commits, handleKeypressFn);

	progressMarker = getTextElement(
		constructProgressText(index, commits.length));

	list.append(progressMarker);

	list.setItems(commits.map(addColorsToItem));
	list.select(index);
	list.focus();

	return list;
}
