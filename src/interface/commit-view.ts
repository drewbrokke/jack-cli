import { decrementIndex, incrementIndex, viewList } from '../redux/action-creators';
import { store } from '../redux/store';
import { BoxElement, KeyEvent, TextElement } from '../types/types';
import { constructProgressText, getBoxElement, getTextElement } from './interface-elements';

export function getCommitElement(content: string, commits: string[], index: number): BoxElement {
	const {length} = commits;

	let contentBox: BoxElement;
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
				store.dispatch(viewList());

				break;

			default: break;
		}
	};

	contentBox = getBoxElement({content}, handleKeypressFn);

	progressMarker = getTextElement(constructProgressText(index, length));

	contentBox.append(progressMarker);
	contentBox.focus();

	return contentBox;
}
