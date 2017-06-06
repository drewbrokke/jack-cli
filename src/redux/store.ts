import * as Redux from 'redux';

import { IState } from '../types/types';
import { reducer } from './reducers';

const initialState: IState = {
	SHA: '',
	commitIndex: 0,
	content: '',
	indexesWithSHAs: [0],
	lines: [],
	listIndex: 0,
	split: false,
	view: 'LIST',
};

export const store = Redux.createStore(reducer, initialState);
