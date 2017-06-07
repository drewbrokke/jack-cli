import * as Redux from 'redux';

import { IState } from '../types/types';
import { reducer } from './reducers';

const initialState: IState = {
	SHA: '',
	index: 0,
	content: '',
	indexesWithSHAs: [0],
	lines: [],
	split: false,
	view: 'LIST',
};

export const store = Redux.createStore(reducer, initialState);
