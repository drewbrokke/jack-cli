import { Action, ActionType, State } from '../types/types';
import { INITIAL_STATE } from './store';

const COMMIT_SHA_REGEX: RegExp = new RegExp(/[0-9a-f]{7,40}\b/);

export const reducer = (
	state: State = INITIAL_STATE,
	action: Action,
): State => {
	switch (action.type) {
		case ActionType.ADD_COMMITS:
			const indexesWithSHAs = [...state.indexesWithSHAs];

			action.payload.forEach((line: string, i: number) => {
				if (COMMIT_SHA_REGEX.test(line)) {
					indexesWithSHAs.push(i + state.lines.length);
				}
			});

			const lines = [...state.lines, ...action.payload];

			return {
				...state,
				SHA: state.SHA
					? state.SHA
					: getSHA(lines[indexesWithSHAs[state.index]], state.SHA),
				indexesWithSHAs,
				lines,
			};

		case ActionType.CLEAR_LOG:
			return INITIAL_STATE;

		case ActionType.MARK_SHA:
			return { ...state, markedSHA: action.payload };

		case ActionType.UPDATE_INDEX:
			const index = Math.min(
				Math.max(state.index + action.payload, 0),
				state.indexesWithSHAs.length - 1,
			);

			return {
				...state,
				SHA: getSHA(
					state.lines[state.indexesWithSHAs[index]],
					state.SHA,
				),
				index,
			};

		case ActionType.UPDATE_STATUS:
			return { ...state, status: action.payload };

		case ActionType.UPDATE_VIEW:
			return { ...state, view: action.payload };

		default:
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
