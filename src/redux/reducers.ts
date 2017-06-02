import { IAction, IState } from '../types/types';
import { COMMIT_SHA_REGEX } from '../util/git-util';

export function reducer(state: IState, action: IAction): IState {
	const currentIndex = state.index;
	const currentCommits = state.commits;
	const currentSHA = state.SHA;

	switch (action.type) {
		case 'ADD_COMMITS':
			const newCommits = typeof action.payload === 'string'
				? Array.of(action.payload)
				: action.payload;

			const commits = [ ...currentCommits, ...newCommits ];

			return { ...state, commits };

		case 'DECREMENT_INDEX':
			const previousValidIndex = getPreviousValidIndex(
				currentIndex - 1, currentIndex, currentCommits);

			return {
				...state,
				SHA: getSHA(previousValidIndex, currentCommits, currentSHA),
				index: previousValidIndex,
			};

		case 'INCREMENT_INDEX':
			const nextValidIndex = getNextValidIndex(
				currentIndex + 1, currentIndex, currentCommits);

			return {
				...state,
				SHA: getSHA(nextValidIndex, currentCommits, currentSHA),
				index: nextValidIndex,
			};

		case 'NOTIFICATION_REQUESTED':
			return {
				...state,
				notificationRequested: true,
				notificationText: action.payload,
			};

		case 'NOTIFICATION_SENT':
			return {
				...state,
				notificationRequested: false,
				notificationText: '',
			};

		case 'VIEW_COMMIT':
			return { ...state, view: 'COMMIT' };

		case 'VIEW_LIST':
			return { ...state, view: 'LIST' };

		default:
			return state;
	}
}

function getNextValidIndex(index: number, prevValidIndex: number, commits: string[]): number {
	if (index >= commits.length) {
		return prevValidIndex;
	}

	if (COMMIT_SHA_REGEX.test(commits[index])) {
		return index;
	}

	return getNextValidIndex(index + 1, prevValidIndex, commits);
}

function getPreviousValidIndex(index: number, prevValidIndex: number, commits: string[]): number {
	if (index < 0) {
		return prevValidIndex;
	}

	if (COMMIT_SHA_REGEX.test(commits[index])) {
		return index;
	}

	return getPreviousValidIndex(index - 1, prevValidIndex, commits);
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
