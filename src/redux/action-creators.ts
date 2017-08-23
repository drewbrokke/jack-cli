import { IAction } from '../types/types';

export const addCommits = (payload: string[]): IAction =>
	({ payload, type: 'ADD_COMMITS' });

export const decrementIndex = (payload: number = 1): IAction =>
	({ payload, type: 'DECREMENT_INDEX' });

export const incrementIndex = (payload: number = 1): IAction =>
	({ payload, type: 'INCREMENT_INDEX' });

export const viewCommit = (): IAction =>
	({ type: 'VIEW_COMMIT' });

export const viewList = (): IAction =>
	({ type: 'VIEW_LIST' });
