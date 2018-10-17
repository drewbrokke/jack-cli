import * as Redux from 'redux';

import { BlessedElement, StateProperty, UpdateFunction } from '../types/types';
import { reducer } from './reducers';

export const store = Redux.createStore(reducer);

export const doSubscribe = <T extends BlessedElement>(
	propertyNames: StateProperty[],
	element: T,
	updateFunction: UpdateFunction<T>,
) => {
	let lastState = store.getState();

	store.subscribe(async () => {
		const modifiedProperties: StateProperty[] = [];

		const state = store.getState();

		for (const propertyName of propertyNames) {
			if (state[propertyName] !== lastState[propertyName]) {
				modifiedProperties.push(propertyName);
			}
		}

		if (
			modifiedProperties.length &&
			!!(await updateFunction({
				element,
				lastState,
				modifiedProperties,
				state,
			}))
		) {
			element.screen.render();
		}

		lastState = state;
	});
};
