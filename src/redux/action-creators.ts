import { IAction } from '../types/types';

export function addCommits(commits: string[]): IAction {
	return {
		payload: commits,
		type: 'ADD_COMMITS',
	};
}

export function decrementIndex(): IAction {
	return {
		type: 'DECREMENT_INDEX',
	};
}

export function incrementIndex(): IAction {
	return {
		type: 'INCREMENT_INDEX',
	};
}

export function setCommitContent(content: string): IAction {
	return {
		payload: content,
		type: 'SET_COMMIT_CONTENT',
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
