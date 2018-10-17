import * as Redux from 'redux';

import { BlessedElement, UpdateFunction } from '../types/types';
import { reducer } from './reducers';

export const store = Redux.createStore(reducer);

export const doSubscribe = <T extends BlessedElement>(
	propertyNames: string[],
	element: T,
	updateFunction: UpdateFunction<T>,
) => {
	let lastState = store.getState();

	store.subscribe(async () => {
		const modifiedProperties: string[] = [];

		const nextState = store.getState();

		for (const propertyName of propertyNames) {
			if (nextState[propertyName] !== lastState[propertyName]) {
				modifiedProperties.push(propertyName);
			}
		}

		if (
			modifiedProperties.length &&
			!!(await updateFunction({
				element,
				lastState,
				modifiedProperties,
				nextState,
			}))
		) {
			element.screen.render();
		}

		lastState = nextState;
	});
};
