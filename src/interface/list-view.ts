import { updateIndex, updateView } from '../redux/action-creators';
import { store } from '../redux/store';
import { IAction, IListElement, View } from '../types/types';
import { KEY_NAV_INTERVAL, stash } from '../util/stash';
import { getListElement } from './interface-elements';
import { notifyInfo } from './notification';

let commitListElement: IListElement;

export const getCommitListElement = (): IListElement => {
	if (commitListElement) {
		return commitListElement;
	}

	commitListElement = getListElement({
		bottom: 0,
		left: 0,
		right: 0,
		style: {
			selected: {
				bg: '#555',
			},
		},
		top: 0,
	});

	const doUpdateIndex = (action: (interval: number) => IAction) => {
		const interval: number = stash.has(KEY_NAV_INTERVAL)
			? stash.get(KEY_NAV_INTERVAL)
			: 1;

		store.dispatch(action(interval));

		if (stash.has(KEY_NAV_INTERVAL)) {
			stash.delete(KEY_NAV_INTERVAL);

			notifyInfo(`Movement interval reset.`);
		}
	};

	commitListElement.key('1234567890'.split(''), (keyName: string) => {
		const newInterval: string = stash.has(KEY_NAV_INTERVAL)
			? `${stash.get(KEY_NAV_INTERVAL)}${keyName}`
			: keyName;

		stash.set(KEY_NAV_INTERVAL, parseInt(newInterval, 10));

		notifyInfo(`Movement interval: ${newInterval}`);
	});
	commitListElement.key(['down', 'j'], () => doUpdateIndex(updateIndex));

	commitListElement.key(['k', 'up'], () =>
		doUpdateIndex((interval: number) => updateIndex(-interval)),
	);

	commitListElement.key(['b', 'pageup'], () =>
		store.dispatch(updateIndex(Number(-commitListElement.height))),
	);

	commitListElement.key(['f', 'pagedown'], () =>
		store.dispatch(updateIndex(Number(commitListElement.height))),
	);

	commitListElement.key(['enter', 'space'], () =>
		store.dispatch(updateView(View.COMMIT)),
	);

	commitListElement.focus();

	store.subscribe(updateCommitListElement());

	return commitListElement;
};

const updateCommitListElement = () => {
	let lastState = store.getState();

	return () => {
		const state = store.getState();

		const { index, lines } = state;

		const listHeight: number = commitListElement.height as number;

		const lineIndex = state.indexesWithSHAs[index];
		const nextLine = state.lines[lineIndex];

		if (
			lines !== lastState.lines &&
			commitListElement.children.length < listHeight
		) {
			commitListElement.setItems(
				lines.slice(lineIndex, lineIndex + listHeight),
			);
		}

		if (!lines.length) {
			commitListElement.setItems(lines);
		} else if (
			index !== lastState.index &&
			commitListElement.getItemIndex(nextLine) !== -1
		) {
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
};
