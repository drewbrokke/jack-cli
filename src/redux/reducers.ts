import { IAction, IState } from '../types/types';

export const COMMIT_SHA_REGEX: RegExp = new RegExp(/[0-9a-f]{7,40}\b/);

export const reducer = (state: IState, action: IAction): IState => {
	const currentIndex = state.index;
	const currentIndexesWithSHAs = state.indexesWithSHAs;
	const currentLines = state.lines;
	const currentSHA = state.SHA;

	switch (action.type) {
		case 'ADD_COMMITS':
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

			let SHA = currentSHA;

			if (!SHA) {
				SHA = getSHA(indexesWithSHAs[currentIndex], lines, SHA);
			}

			return {
				...state,
				SHA,
				indexesWithSHAs,
				lines,
			};

		case 'LOG_COMPLETED':
			return {
				...state,
				logCompleted: true,
			};

		case 'MARK_SHA':
			return {
				...state,
				markedSHA: action.payload,
			};

		case 'UPDATE_INDEX':
			const newIndex = Math.min(
				Math.max(currentIndex + action.payload, 0),
				(currentIndexesWithSHAs.length - 1));

			return {
				...state,
				SHA: getSHA(
					currentIndexesWithSHAs[newIndex], currentLines, currentSHA),
				index: newIndex,
			};

		case 'UPDATE_VIEW':
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
