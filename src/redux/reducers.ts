import { IAction, IState } from '../types/types';

export const COMMIT_SHA_REGEX: RegExp = new RegExp(/[0-9a-f]{7,40}\b/);

export function reducer(state: IState, action: IAction): IState {
	const currentIndex = state.index;
	const currentIndexesWithSHAs = state.indexesWithSHAs;
	const currentLines = state.lines;
	const currentSHA = state.SHA;

	switch (action.type) {
		case 'ADD_COMMITS':
			const newLines = typeof action.payload === 'string'
				? Array.of(action.payload)
				: action.payload;

			const lines = [ ...currentLines, ...newLines ];

			const newIndexesWithSHAs: number[] = newLines
				.map((line: string, index: number) => {
					if (COMMIT_SHA_REGEX.test(line)) {
						return index + currentLines.length;
					}

					return 0;
				})
				.filter(Boolean);

			const indexesWithSHAs: number[] = [ ...currentIndexesWithSHAs, ...newIndexesWithSHAs ];

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

		case 'DECREMENT_INDEX':
			const previousIndex =
				(currentIndex - action.payload >= 0)
					? currentIndex - action.payload
					: 0;

			return {
				...state,
				SHA: getSHA(currentIndexesWithSHAs[previousIndex], currentLines, currentSHA),
				index: previousIndex,
			};

		case 'INCREMENT_INDEX':
			const currentIndexesWithSHAsLength = currentIndexesWithSHAs.length;

			const nextIndex =
				(currentIndex + action.payload < currentIndexesWithSHAsLength)
					? currentIndex + action.payload
					: currentIndexesWithSHAsLength - 1;

			return {
				...state,
				SHA: getSHA(currentIndexesWithSHAs[nextIndex], currentLines, currentSHA),
				index: nextIndex,
			};

		case 'VIEW_COMMIT':
			return { ...state, view: 'COMMIT' };

		case 'VIEW_LIST':
			return { ...state, view: 'LIST' };

		default:
			return state;
	}
}

function getSHA(index: number, commits: string[], currentSHA: string): string {
	const matches: RegExpExecArray | null = COMMIT_SHA_REGEX.exec(commits[index]);

	if (!matches) {
		return currentSHA;
	}

	const sha: string | null = matches[0];

	if (sha) {
		return sha;
	}

	return currentSHA;
}
