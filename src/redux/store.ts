import * as Redux from 'redux';

import { IState, Status, View } from '../types/types';
import { reducer } from './reducers';

export const initialState: IState = {
	SHA: '',
	index: 0,
	indexesWithSHAs: [0],
	lines: [],
	markedSHA: '',
	status: Status.RETRIEVING_LOG,
	view: View.LIST,
};

export const store = Redux.createStore(reducer, initialState);
