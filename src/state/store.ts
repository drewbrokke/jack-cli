import {
	Action,
	BlessedElement,
	State,
	StateProperty,
	Status,
	UpdateFunction,
	View,
} from '../types/types';
import { reducer } from './reducers';

export const INITIAL_STATE: State = {
	SHA: '',
	index: 0,
	indexesMatchingSearch: [],
	indexesWithSHAs: [],
	lines: [],
	markedSHA: '',
	search: '',
	status: Status.RETRIEVING_LOG,
	view: View.LIST,
};

export interface Store {
	dispatch(action: Action): void;
	getState(): State;
	subscribe(updateFn: () => void): void;
}

const getStore = (
	reducerFn: (state: State, action: Action) => State,
): Store => {
	let state: State = { ...INITIAL_STATE };
	const subscribers: Array<() => void> = [];

	return {
		dispatch(action: Action) {
			state = reducerFn(state, action);

			subscribers.forEach((subscriber) => subscriber());
		},

		getState() {
			return { ...state };
		},

		subscribe(updateFn: () => void) {
			subscribers.push(updateFn);
		},
	};
};

export const store: Store = getStore(reducer);

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
				state,
			}))
		) {
			element.screen.render();
		}

		lastState = state;
	});
};
