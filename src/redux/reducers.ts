import { ActionType, IAction, IState, Status, View } from '../types/types';

const COMMIT_SHA_REGEX: RegExp = new RegExp(/[0-9a-f]{7,40}\b/);
const INITIAL_STATE: IState = {
	SHA: '',
	index: 0,
	indexesWithSHAs: [0],
	lines: [],
	markedSHA: '',
	status: Status.RETRIEVING_LOG,
	view: View.LIST,
};

export const reducer =
	(state: IState = INITIAL_STATE, action: IAction): IState => {

		const {
			index: currentIndex,
			indexesWithSHAs: currentIndexesWithSHAs,
			lines: currentLines,
			SHA: currentSHA,
		} = state;

		switch (action.type) {
			case ActionType.ADD_COMMITS:
				const newLines = typeof action.payload === 'string'
					? Array.of(action.payload)
					: action.payload;

				const lines = [...currentLines, ...newLines];

				const newIndexesWithSHAs: number[] = newLines
					.map((line: string, index: number) => {
						if (COMMIT_SHA_REGEX.test(line)) {
							return index + currentLines.length;
						}

						return 0;
					})
					.filter(Boolean);

				const indexesWithSHAs: number[] =
					[...currentIndexesWithSHAs, ...newIndexesWithSHAs];

				const SHA = currentSHA
					? currentSHA
					: getSHA(indexesWithSHAs[currentIndex], lines, currentSHA);

				return { ...state, SHA, indexesWithSHAs, lines };

			case ActionType.CLEAR_LOG:
				return INITIAL_STATE;

			case ActionType.MARK_SHA:
				return { ...state, markedSHA: action.payload };

			case ActionType.UPDATE_INDEX:
				const newIndex = Math.min(
					Math.max(currentIndex + action.payload, 0),
					(currentIndexesWithSHAs.length - 1));

				return {
					...state,
					SHA: getSHA(
						currentIndexesWithSHAs[newIndex], currentLines, currentSHA),
					index: newIndex,
				};

			case ActionType.UPDATE_STATUS:
				return { ...state, status: action.payload };

			case ActionType.UPDATE_VIEW:
				return { ...state, view: action.payload };

			default:
				return state;
		}
	};

const getSHA =
	(index: number, commits: string[], currentSHA: string): string => {

		const matches: RegExpExecArray | null =
			COMMIT_SHA_REGEX.exec(commits[index]);

		if (!matches) {
			return currentSHA;
		}

		const sha: string | null = matches[0];

		if (sha) {
			return sha;
		}

		return currentSHA;
	};
