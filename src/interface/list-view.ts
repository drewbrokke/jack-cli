import { Actions } from '../state/actions';
import { doSubscribe } from '../state/store';
import { ListElement, UpdateFunction, View } from '../types/types';
import { NAV_INTERVAL, stash } from '../util/stash';
import { getListElement } from './interface-elements';
import { notifier } from './notification';
import { getSearchInput } from './search-bar';

import { searchIndex } from '../util/search';

export const getCommitListElement = (): ListElement => {
	const commitListElement: ListElement = getListElement({
		bottom: 0,
		left: 0,
		name: 'commitLogContainer',
		right: 0,
		style: {
			selected: {
				bg: '#555',
			},
		},
		tags: true,
		top: 0,
	});

	const doUpdateIndex = (action: (interval: number) => void) => {
		const interval: number = stash.has(NAV_INTERVAL)
			? stash.get(NAV_INTERVAL)
			: 1;

		action(interval);

		if (stash.has(NAV_INTERVAL)) {
			stash.delete(NAV_INTERVAL);

			notifier.info(`Movement interval reset.`);
		}
	};

	commitListElement.key('1234567890'.split(''), (keyName: string) => {
		const newInterval: string = stash.has(NAV_INTERVAL)
			? `${stash.get(NAV_INTERVAL)}${keyName}`
			: keyName;

		stash.set(NAV_INTERVAL, parseInt(newInterval, 10));

		notifier.info(`Movement interval: ${newInterval}`);
	});
	commitListElement.key(['down', 'j'], () =>
		doUpdateIndex(Actions.updateIndex),
	);

	commitListElement.key(['k', 'up'], () =>
		doUpdateIndex((interval: number) => Actions.updateIndex(-interval)),
	);

	commitListElement.key(['b', 'pageup'], () =>
		Actions.updateIndex(-commitListElement.height),
	);

	commitListElement.key(['f', 'pagedown'], () =>
		Actions.updateIndex(+commitListElement.height),
	);

	commitListElement.key(['enter', 'space'], () =>
		Actions.updateView(View.COMMIT),
	);

	commitListElement.key('/', () => {
		const searchInput = getSearchInput(async (value) => {
			const results = await searchIndex.search(value);

			Actions.updateSearch({
				indexesMatchingSearch: results,
				searchTerm: value,
			});
		});

		commitListElement.screen.append(searchInput);

		searchInput.show();
		searchInput.focus();

		commitListElement.screen.render();
	});

	commitListElement.key('n', () => Actions.nextSearchResult());
	commitListElement.key('S-n', () => Actions.previousSearchResult());

	commitListElement.focus();

	doSubscribe(['index', 'search'], commitListElement, renderIndex);
	doSubscribe(['visibleLines'], commitListElement, renderLines);

	return commitListElement;
};

const renderIndex: UpdateFunction<ListElement> = async ({
	element: commitListElement,
	lastState,
	state,
}) => {
	const { index, visibleLines } = state;

	const listHeight: number = commitListElement.height as number;

	const nextLine = visibleLines[index];

	if (!visibleLines.length) {
		commitListElement.setItems(visibleLines as string[]);
	} else if (commitListElement.getItemIndex(nextLine) !== -1) {
		commitListElement.select(commitListElement.getItemIndex(nextLine));
	} else if (index > lastState.index) {
		commitListElement.setItems(
			visibleLines.slice(index - listHeight, index + 1),
		);

		commitListElement.select(commitListElement.children.length - 1);
	} else if (index < lastState.index || state.search !== lastState.search) {
		commitListElement.setItems(
			visibleLines.slice(index, index + listHeight),
		);

		commitListElement.select(0);
	} else {
		return false;
	}

	return true;
};

const renderLines: UpdateFunction<ListElement> = async ({ element, state }) => {
	const { index, visibleLines } = state;

	const listHeight: number = element.height as number;

	if (
		element.children.length < listHeight ||
		visibleLines.length < listHeight
	) {
		const lineIndex = state.indexesWithSHAs[index];

		element.setItems(visibleLines.slice(lineIndex, lineIndex + listHeight));

		return true;
	}

	return false;
};
