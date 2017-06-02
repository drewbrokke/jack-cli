import * as Redux from 'redux';

import { IState } from '../types/types';
import { reducer } from './reducers';

const initialState: IState = {
	SHA: '',
	commits: [],
	content: '',
	index: 0,
	notificationRequested: false,
	notificationText: '',
	split: false,
	view: 'LIST',
};

export const store = Redux.createStore(reducer, initialState);
