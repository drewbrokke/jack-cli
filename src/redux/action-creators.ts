import { IAction } from '../types/types';

export function addCommits(commits: string[]): IAction {
	return {
		payload: commits,
		type: 'ADD_COMMITS',
	};
}

export function decrementIndex(amount: number = 1): IAction {
	return {
		payload: amount,
		type: 'DECREMENT_INDEX',
	};
}

export function incrementIndex(amount: number = 1): IAction {
	return {
		payload: amount,
		type: 'INCREMENT_INDEX',
	};
}

export function viewCommit(): IAction {
	return {
		type: 'VIEW_COMMIT',
	};
}

export function viewList(): IAction {
	return {
		type: 'VIEW_LIST',
	};
}
