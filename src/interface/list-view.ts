import { decrementIndex, incrementIndex, viewCommit } from '../redux/action-creators';
import { store } from '../redux/store';
import { IListElement } from '../types/types';
import { getListElement } from './interface-elements';

let commitListElement: IListElement;

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

	commitListElement.key(['down', 'j'], () => store.dispatch(incrementIndex()));
	commitListElement.key(['k', 'up'], () => store.dispatch(decrementIndex()));
	commitListElement.key(['enter', 'space'], () => store.dispatch(viewCommit()));

	commitListElement.focus();

	store.subscribe(updateCommitListElement());

	return commitListElement;
}

function updateCommitListElement() {
	let lastState = store.getState();

	return () => {
		const state = store.getState();

		const {commits, index, view} = state;

		const isListView: boolean = view === 'LIST';

		if (isListView && commitListElement.hidden) {
			commitListElement.show();
			commitListElement.focus();
		} else if (view === 'COMMIT' && commitListElement.visible) {
			commitListElement.hide();
		}

		if (commits !== lastState.commits) {
			commitListElement.setItems(commits);
		}

		if (index !== lastState.index) {
			commitListElement.select(index);
		}

		lastState = state;

		commitListElement.screen.render();
	};
}
