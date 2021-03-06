import { Action, ActionType, State } from '../types/types';
import { colors } from '../util/colors';
import { getBlacklistPatterns, getShowLineNumbers } from '../util/config-util';
import { getNextIndex, getPreviousIndex } from '../util/util-functions';
import { INITIAL_STATE } from './store';

const COMMIT_SHA_REGEX: RegExp = new RegExp(/[0-9a-f]{7,40}\b/);

const blacklistPatterns: RegExp[] = getBlacklistPatterns();
const showLineNumbers = getShowLineNumbers();

export const reducer = (
	state: State = INITIAL_STATE,
	action: Action,
): State => {
	if (action.type === ActionType.ADD_COMMITS) {
		const indexesWithSHAs = [...state.indexesWithSHAs];

		const newLines = action.payload.map((line: string, i: number) => {
			if (
				COMMIT_SHA_REGEX.test(line) &&
				!blacklistPatterns.some((blacklistPattern) =>
					blacklistPattern.test(line),
				)
			) {
				const indexWithLine = i + state.lines.length;

				indexesWithSHAs.push(indexWithLine);

				if (showLineNumbers) {
					return `${indexesWithSHAs.length}: ${line}`;
				}
			}

			return line;
		});

		const lines = [...state.lines, ...newLines];
		const visibleLines = [...state.visibleLines, ...newLines];

		const index = indexesWithSHAs.includes(state.index)
			? state.index
			: getNextIndex(indexesWithSHAs, state.index);

		return {
			...state,
			SHA: state.SHA ? state.SHA : getSHA(lines[state.index], state.SHA),
			index,
			indexesWithSHAs,
			lines,
			visibleLines,
		};
	} else if (action.type === ActionType.CLEAR_LOG) {
		return INITIAL_STATE;
	} else if (action.type === ActionType.MARK_SHA) {
		return { ...state, markedSHA: action.payload };
	} else if (action.type === ActionType.NEXT_SEARCH_RESULT) {
		let { index, SHA } = state;
		const { indexesWithSHAs, indexesMatchingSearch, lines } = state;

		if (indexesMatchingSearch.length) {
			let searchResultIndex = getNextIndex(
				[...indexesMatchingSearch],
				index,
			);

			if (!indexesWithSHAs.includes(searchResultIndex)) {
				const nextSHAIndex = getNextIndex([...indexesWithSHAs], index);

				if (searchResultIndex < nextSHAIndex) {
					searchResultIndex = getNextIndex(
						[...indexesMatchingSearch],
						searchResultIndex,
					);
				}

				index = getPreviousIndex(
					[...indexesWithSHAs],
					searchResultIndex,
				);
			} else {
				index = searchResultIndex;
			}

			SHA = getSHA(lines[index], SHA);
		}

		return {
			...state,
			SHA,
			index,
		};
	} else if (action.type === ActionType.PREVIOUS_SEARCH_RESULT) {
		let { index, SHA } = state;
		const { indexesWithSHAs, indexesMatchingSearch, lines } = state;

		if (indexesMatchingSearch.length) {
			const searchResultIndex = getPreviousIndex(
				[...indexesMatchingSearch],
				index,
			);

			if (!indexesWithSHAs.includes(searchResultIndex)) {
				index = getPreviousIndex(
					[...indexesWithSHAs],
					searchResultIndex,
				);
			} else {
				index = searchResultIndex;
			}

			SHA = getSHA(lines[index], SHA);
		}

		return {
			...state,
			SHA,
			index,
		};
	} else if (action.type === ActionType.UPDATE_SEARCH) {
		const indexesMatchingSearch: number[] =
			action.payload.indexesMatchingSearch;
		const searchTerm: string = action.payload.searchTerm;

		let { index, SHA } = state;
		const { indexesWithSHAs, lines } = state;

		const visibleLines: string[] = [...lines];

		if (indexesMatchingSearch.length) {
			const searchRegex = new RegExp(
				searchTerm.replace(new RegExp(' ', 'g'), '.*?'),
				'gi',
			);

			indexesMatchingSearch.forEach((i) => {
				visibleLines[i] = visibleLines[i].replace(
					searchRegex,
					colors.searchHit,
				);
			});

			let searchResultIndex = index;

			if (!indexesMatchingSearch.includes(index)) {
				searchResultIndex = getNextIndex(indexesMatchingSearch, index);
			}

			if (!indexesWithSHAs.includes(searchResultIndex)) {
				index = getPreviousIndex(
					[...indexesWithSHAs],
					searchResultIndex,
				);
			} else {
				index = searchResultIndex;
			}

			SHA = getSHA(lines[index], SHA);
		}

		return {
			...state,
			SHA,
			index,
			indexesMatchingSearch,
			search: searchTerm,
			visibleLines,
		};
	} else if (action.type === ActionType.UPDATE_INDEX) {
		const indexFn = action.payload > 0 ? getNextIndex : getPreviousIndex;

		let { index } = state;
		const { indexesWithSHAs } = state;

		for (let i = Math.abs(action.payload); i > 0; i--) {
			index = indexFn([...indexesWithSHAs], index);
		}

		return {
			...state,
			SHA: getSHA(state.lines[index], state.SHA),
			index,
		};
	} else if (action.type === ActionType.UPDATE_STATUS) {
		return { ...state, status: action.payload };
	} else if (action.type === ActionType.UPDATE_VIEW) {
		return { ...state, view: action.payload };
	} else {
		return state;
	}
};

const getSHA = (lineText: string, defaultValue: string): string => {
	const matches: RegExpExecArray | null = COMMIT_SHA_REGEX.exec(lineText);

	if (!matches) {
		return defaultValue;
	}

	const matchedSHA: string | null = matches[0];

	if (matchedSHA) {
		return matchedSHA;
	}

	return defaultValue;
};
