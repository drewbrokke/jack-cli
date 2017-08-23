import { IAction } from '../types/types';

export const addCommits = (commits: string[]): IAction =>
	({ payload: commits, type: 'ADD_COMMITS' });

export const decrementIndex = (amount: number = 1): IAction =>
	({ payload: amount, type: 'DECREMENT_INDEX' });

export const incrementIndex = (amount: number = 1): IAction =>
	({ payload: amount, type: 'INCREMENT_INDEX' });

export const viewCommit = (): IAction =>
	({ type: 'VIEW_COMMIT' });

export const viewList = (): IAction =>
	({ type: 'VIEW_LIST' });
