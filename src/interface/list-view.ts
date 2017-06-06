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

		stash.delete(NAV_INTERVAL);

		notifyInfo(`Movement interval reset.`);
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
	commitListElement.key(['enter', 'space'], () => store.dispatch(viewCommit()));

	commitListElement.focus();

	store.subscribe(updateCommitListElement());

	return commitListElement;
}

function updateCommitListElement() {
	let lastState = store.getState();

	return () => {
		const state = store.getState();

		const {lines, listIndex, view} = state;

		const isListView: boolean = view === 'LIST';

		if (isListView && commitListElement.hidden) {
			commitListElement.show();
			commitListElement.focus();
		} else if (view === 'COMMIT' && commitListElement.visible) {
			commitListElement.hide();
		}

		if (lines !== lastState.lines) {
			commitListElement.setItems(lines);
		}

		if (listIndex !== lastState.listIndex) {
			commitListElement.select(listIndex);
		}

		lastState = state;

		commitListElement.screen.render();
	};
}
