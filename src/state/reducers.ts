import { Action, ActionType, State } from '../types/types';
import { getBlacklistPatterns, getShowLineNumbers } from '../util/config-util';
import { INITIAL_STATE } from './store';
import { getNextIndex, getPreviousIndex } from '../util/util-functions';

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

		const index = indexesWithSHAs.includes(state.index)
			? state.index
			: getNextIndex(indexesWithSHAs, state.index);

		return {
			...state,
			SHA: state.SHA ? state.SHA : getSHA(lines[state.index], state.SHA),
			index,
			indexesWithSHAs,
			lines,
		};
	} else if (action.type === ActionType.CLEAR_LOG) {
		return INITIAL_STATE;
	} else if (action.type === ActionType.MARK_SHA) {
		return { ...state, markedSHA: action.payload };
	} else if (action.type === ActionType.NEXT_SEARCH_RESULT) {
		let { index, indexesMatchingSearch, lines, SHA } = state;

		if (indexesMatchingSearch.length) {
			index = getNextIndex([...indexesMatchingSearch], index);
			SHA = getSHA(lines[index], SHA);
		}

		return {
			...state,
			index,
			SHA,
		};
	} else if (action.type === ActionType.PREVIOUS_SEARCH_RESULT) {
		let { index, indexesMatchingSearch, lines, SHA } = state;

		if (indexesMatchingSearch.length) {
			index = getPreviousIndex([...indexesMatchingSearch], index);
			SHA = getSHA(lines[index], SHA);
		}

		return {
			...state,
			index,
			SHA,
		};
	} else if (action.type === ActionType.UPDATE_SEARCH) {
		let indexesMatchingSearch: number[] = [];
		const { index, indexesWithSHAs, lines, SHA } = state;

		let newIndex = index;
		let newSHA = SHA;

		if (!!action.payload) {
			const searchTerm = action.payload.toLowerCase();

			for (let i = 0; i < lines.length; i++) {
				if (!indexesWithSHAs.includes(i)) {
					continue;
				}

				const searchableLine = lines[i].toLowerCase();

				if (searchableLine.includes(searchTerm)) {
					indexesMatchingSearch.push(i);
				}
			}
		}

		if (indexesMatchingSearch.length) {
			newIndex = getNextIndex(indexesMatchingSearch, newIndex);
			newSHA = getSHA(lines[newIndex], newSHA);
		}

		return {
			...state,
			index: newIndex,
			indexesMatchingSearch,
			SHA: newSHA,
		};
	} else if (action.type === ActionType.UPDATE_INDEX) {
		const indexFn = action.payload > 0 ? getNextIndex : getPreviousIndex;

		let { index, indexesWithSHAs } = state;

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
