import { IAction, View } from '../types/types';

export const addCommits = (payload: string[]): IAction =>
	({ payload, type: 'ADD_COMMITS' });

export const decrementIndex = (payload: number = 1): IAction =>
	({ payload, type: 'DECREMENT_INDEX' });

export const incrementIndex = (payload: number = 1): IAction =>
	({ payload, type: 'INCREMENT_INDEX' });

export const logCompleted = (): IAction =>
	({ type: 'LOG_COMPLETED' });

export const markSHA = (payload: string | null): IAction =>
	({ payload, type: 'MARK_SHA' });

export const updateView = (payload: View): IAction =>
	({ payload, type: 'UPDATE_VIEW' });
