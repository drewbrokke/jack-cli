import { ActionType, IAction, Status, View } from '../types/types';

export const addCommits = (payload: string[]): IAction => ({
	payload,
	type: ActionType.ADD_COMMITS,
});

export const clearLog = (): IAction => ({ type: ActionType.CLEAR_LOG });

export const markSHA = (payload: string | null): IAction => ({
	payload,
	type: ActionType.MARK_SHA,
});

export const updateIndex = (payload: number): IAction => ({
	payload,
	type: ActionType.UPDATE_INDEX,
});

export const updateStatus = (payload: Status): IAction => ({
	payload,
	type: ActionType.UPDATE_STATUS,
});

export const updateView = (payload: View): IAction => ({
	payload,
	type: ActionType.UPDATE_VIEW,
});
