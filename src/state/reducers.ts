import { Action, ActionType, State } from '../types/types';
import { getBlacklistPatterns, getShowLineNumbers } from '../util/config-util';
import { INITIAL_STATE } from './store';

const COMMIT_SHA_REGEX: RegExp = new RegExp(/[0-9a-f]{7,40}\b/);

const blacklistPatterns: RegExp[] = getBlacklistPatterns();
const showLineNumbers = getShowLineNumbers();

export const reducer = (
	state: State = INITIAL_STATE,
	action: Action,
): State => {
	switch (action.type) {
		case ActionType.ADD_COMMITS:
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
