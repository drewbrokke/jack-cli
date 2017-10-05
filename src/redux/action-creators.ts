import { IAction, Status, View } from '../types/types';

export const addCommits = (payload: string[]): IAction =>
	({ payload, type: 'ADD_COMMITS' });

export const markSHA = (payload: string | null): IAction =>
	({ payload, type: 'MARK_SHA' });

export const updateIndex = (payload: number): IAction =>
	({ payload, type: 'UPDATE_INDEX' });

export const updateStatus = (payload: Status): IAction =>
	({ payload, type: 'UPDATE_STATUS' });

export const updateView = (payload: View): IAction =>
	({ payload, type: 'UPDATE_VIEW' });
