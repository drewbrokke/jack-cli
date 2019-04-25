import { Action, ActionType, Status, View } from '../types/types';

export const addCommits = (payload: string[]): Action => ({
	payload,
	type: ActionType.ADD_COMMITS,
});

export const clearLog = (): Action => ({ type: ActionType.CLEAR_LOG });

export const markSHA = (payload: string | null): Action => ({
	payload,
	type: ActionType.MARK_SHA,
});

export const nextSearchResult = (): Action => ({
	type: ActionType.NEXT_SEARCH_RESULT,
});

export const previousSearchResult = (): Action => ({
	type: ActionType.PREVIOUS_SEARCH_RESULT,
});

export const updateIndex = (payload: number): Action => ({
	payload,
	type: ActionType.UPDATE_INDEX,
});

export const updateSearch = (payload: string | null): Action => ({
	payload,
	type: ActionType.UPDATE_SEARCH,
});

export const updateStatus = (payload: Status): Action => ({
	payload,
	type: ActionType.UPDATE_STATUS,
});

export const updateView = (payload: View): Action => ({
	payload,
	type: ActionType.UPDATE_VIEW,
});
