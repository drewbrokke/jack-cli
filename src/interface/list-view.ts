import { decrementIndex, incrementIndex, viewCommit } from '../redux/action-creators';
import { store } from '../redux/store';
import { IAction, IListElement } from '../types/types';
import { stash } from '../util/stash';
import { getListElement } from './interface-elements';
import { notifyInfo } from './notification';

let commitListElement: IListElement;

const NAV_INTERVAL: string = 'NAV_INTERVAL';

export function getCommitListElement(): IListElement {
	if (commitListElement) {
		return commitListElement;
	}

	commitListElement = getListElement({
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

	function doUpdateIndex(action: (interval: number) => IAction) {
		let interval = 1;

		const intervalFromStash: number | undefined = stash.get(NAV_INTERVAL);

		if (intervalFromStash) {
			interval = intervalFromStash;
		}

		store.dispatch(action(interval));

		if (intervalFromStash) {
			stash.delete(NAV_INTERVAL);

			notifyInfo(`Movement interval reset.`);
		}
	}

	commitListElement.key('1234567890'.split(''), (keyName: string) => {
		let newInterval = keyName;

		const intervalFromStash: number | undefined = stash.get(NAV_INTERVAL);

		if (intervalFromStash) {
			newInterval = `${intervalFromStash}${newInterval}`;
		}

		stash.set(NAV_INTERVAL, parseInt(newInterval, 10));

		notifyInfo(`Movement interval: ${newInterval}`);
	});
	commitListElement.key(['down', 'j'], () => doUpdateIndex(incrementIndex));
	commitListElement.key(['k', 'up'], () => doUpdateIndex(decrementIndex));
	commitListElement.key(['b', 'pageup'], () => store.dispatch(decrementIndex(Number(commitListElement.height))));
	commitListElement.key(['f', 'pagedown'], () => store.dispatch(incrementIndex(Number(commitListElement.height))));
	commitListElement.key(['enter', 'space'], () => store.dispatch(viewCommit()));

	commitListElement.focus();

	store.subscribe(updateCommitListElement());

	return commitListElement;
}

function updateCommitListElement() {
	let lastState = store.getState();

	return () => {
		const state = store.getState();

		const {index, lines, view} = state;

		const isListView: boolean = view === 'LIST';

		if (isListView && commitListElement.hidden) {
			commitListElement.show();
			commitListElement.focus();
		} else if (view === 'COMMIT' && commitListElement.visible) {
			commitListElement.hide();
		}

		const listHeight: number = commitListElement.height as number;

		const lineIndex = state.indexesWithSHAs[index];
		const nextLine = state.lines[lineIndex];

		if (lines !== lastState.lines && commitListElement.children.length < listHeight) {
			commitListElement.setItems(lines.slice(lineIndex, lineIndex + listHeight));
		}

		if (index !== lastState.index && commitListElement.getItemIndex(nextLine) !== -1) {
			commitListElement.select(commitListElement.getItemIndex(nextLine));
		} else if (index > lastState.index) {
			const newLines = lines.slice(lineIndex - listHeight, lineIndex + 1);

			commitListElement.setItems(newLines);

			commitListElement.select(newLines.indexOf(nextLine));
		} else if (index < lastState.index) {
			const newLines = lines.slice(lineIndex, lineIndex + listHeight);

			commitListElement.setItems(newLines);

			commitListElement.select(newLines.indexOf(nextLine));
		}

		lastState = state;

		commitListElement.screen.render();
	};
}
