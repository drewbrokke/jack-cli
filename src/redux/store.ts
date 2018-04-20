import * as Redux from 'redux';

import { reducer } from './reducers';

export const store = Redux.createStore(reducer);
