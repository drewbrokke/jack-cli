import { IAction, IState } from '../types/types';
import { COMMIT_SHA_REGEX } from '../util/git-util';

export function reducer(state: IState, action: IAction): IState {
	const currentIndex = state.index;
	const currentCommits = state.commits;

	switch (action.type) {
		case 'ADD_COMMITS':
			const newCommits = typeof action.payload === 'string'
				? Array.of(action.payload)
				: action.payload;

			const commits = [ ...currentCommits, ...newCommits ];

			return { ...state, commits };

		case 'DECREMENT_INDEX':
			return { ...state, index: getSafeIndex(currentIndex - 1, currentCommits) };

		case 'INCREMENT_INDEX':
			return { ...state, index: getSafeIndex(currentIndex + 1, currentCommits) };

		case 'TOGGLE_SPLIT':
			return { ...state, split: !state.split };

		case 'VIEW_COMMIT':
			return { ...state, view: 'COMMIT' };

		case 'VIEW_LIST':
			return { ...state, view: 'LIST' };

		default:
			return state;
	}
}

function getNextValidIndex(index: number, prevValidIndex: number, commits: string[]): number {
	if (index === commits.length) {
		return prevValidIndex;
	}

	if (COMMIT_SHA_REGEX.test(commits[index])) {
		return index;
	}

	return getNextValidIndex(index + 1, prevValidIndex, commits);
}

function getPreviousValidIndex(index: number, prevValidIndex: number, commits: string[]): number {
	if (index === 0) {
		return prevValidIndex;
	}

	if (COMMIT_SHA_REGEX.test(commits[index])) {
		return index;
	}

	return getPreviousValidIndex(index + 1, prevValidIndex, commits);
}

function getSafeIndex(index: number, commits: string[]): number {
	if (index < 0) {
		return 0;
	}

	if (index >= commits.length) {
		return commits.length - 1;
	}

	return index;
}
