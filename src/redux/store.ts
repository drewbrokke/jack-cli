import * as Redux from 'redux';

import { IState } from '../types/types';
import { reducer } from './reducers';

const initialState: IState = {
	SHA: '',
	index: 0,
	indexesWithSHAs: [0],
	lines: [],
	markedSHA: '',
	split: false,
	status: 'RETRIEVING_LOG',
	view: 'LIST',
};

export const store = Redux.createStore(reducer, initialState);
