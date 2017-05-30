import { Action, doAction } from './action-handler';
import { COMMIT_ELEMENT_SEPARATOR, getCommitContent } from './git-util';
import { constructProgressText, getCommitListElement, getTextElement } from './interface-elements';
import { BoxElement, IListElement, KeyEvent, Screen, TextElement } from './types';

export function renderListView(screen: Screen): void {
	const {commits, index} = screen.data;
	let list: IListElement;
	let progressMarker: TextElement;

	const listLength: number | undefined = commits.length;

	async function listOnSelectFn(_item: BoxElement, newIndex: number) {
		const [sha] = commits[newIndex].split(COMMIT_ELEMENT_SEPARATOR);

		const content = await getCommitContent(sha);

		doAction(
			Action.RENDER_COMMIT, {commits, content, index: newIndex, screen});
	}

	const handleKeypressFn = (_ch: string, key: KeyEvent) => {
		switch (key.name) {
			case 'down':
			case 'j':
			case 'k':
			case 'up':
				progressMarker.setContent(
					constructProgressText(list.selected, listLength));

				screen.render();

				break;

			case 'space':
				if (list.enterSelected) {
					list.enterSelected();
				}

				break;

			default: break;
		}
	};

	list = getCommitListElement(commits, listOnSelectFn, handleKeypressFn);

	progressMarker = getTextElement(
		constructProgressText(index, commits.length));

	list.append(progressMarker);
	list.select(index);
	list.focus();

	screen.append(list);
	screen.render();
}
