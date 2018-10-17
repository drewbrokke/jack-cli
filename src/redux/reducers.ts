import { produce } from 'immer';
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

export const reducer = (
	state: IState = INITIAL_STATE,
	action: IAction,
): IState =>
	produce(state, (draft) => {
		const {
			index: currentIndex,
			indexesWithSHAs: currentIndexesWithSHAs,
			lines: currentLines,
			SHA: currentSHA,
		} = state;

		switch (action.type) {
			case ActionType.ADD_COMMITS:
				const newLines = action.payload;

				const lines = [...currentLines, ...newLines];

				const newIndexesWithSHAs: number[] = newLines
					.map((line: string, index: number) => {
						if (COMMIT_SHA_REGEX.test(line)) {
							return index + currentLines.length;
						}

						return 0;
					})
					.filter(Boolean);

				const indexesWithSHAs: number[] = [
					...currentIndexesWithSHAs,
					...newIndexesWithSHAs,
				];

				const SHA = currentSHA
					? currentSHA
					: getSHA(indexesWithSHAs[currentIndex], lines, currentSHA);

				draft.SHA = SHA;
				draft.lines = lines;
				draft.indexesWithSHAs = indexesWithSHAs;

				break;

			case ActionType.CLEAR_LOG:
				Object.assign(draft, INITIAL_STATE);
				break;

			case ActionType.MARK_SHA:
				draft.markedSHA = action.payload;
				break;

			case ActionType.UPDATE_INDEX:
				const newIndex = Math.min(
					Math.max(currentIndex + action.payload, 0),
					currentIndexesWithSHAs.length - 1,
				);

				draft.SHA = getSHA(
					currentIndexesWithSHAs[newIndex],
					currentLines,
					currentSHA,
				);

				draft.index = newIndex;

				break;

			case ActionType.UPDATE_STATUS:
				draft.status = action.payload;
				break;

			case ActionType.UPDATE_VIEW:
				draft.view = action.payload;
				break;
		}
	});

const getSHA = (
	index: number,
	commits: string[],
	currentSHA: string,
): string => {
	const matches: RegExpExecArray | null = COMMIT_SHA_REGEX.exec(
		commits[index],
	);

	if (!matches) {
		return currentSHA;
	}

	const sha: string | null = matches[0];

	if (sha) {
		return sha;
	}

	return currentSHA;
};
