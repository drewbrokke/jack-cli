import { ActionType, Status, View } from '../types/types';
import { store } from './store';

export class Actions {
	public static addCommits(payload: string[]): void {
		store.dispatch({
			payload,
			type: ActionType.ADD_COMMITS,
		});
	}

	public static clearLog(): void {
		store.dispatch({ type: ActionType.CLEAR_LOG });
	}

	public static markSHA(payload: string | null): void {
		store.dispatch({
			payload,
			type: ActionType.MARK_SHA,
		});
	}

	public static nextSearchResult(): void {
		store.dispatch({
			type: ActionType.NEXT_SEARCH_RESULT,
		});
	}

	public static previousSearchResult(): void {
		store.dispatch({
			type: ActionType.PREVIOUS_SEARCH_RESULT,
		});
	}

	public static updateIndex(payload: number): void {
		store.dispatch({
			payload,
			type: ActionType.UPDATE_INDEX,
		});
	}

	public static updateSearch(payload: {
		searchTerm: string;
		indexesMatchingSearch: number[] | null;
	}): void {
		store.dispatch({
			payload,
			type: ActionType.UPDATE_SEARCH,
		});
	}

	public static updateStatus(payload: Status): void {
		store.dispatch({
			payload,
			type: ActionType.UPDATE_STATUS,
		});
	}

	public static updateView(payload: View): void {
		store.dispatch({
			payload,
			type: ActionType.UPDATE_VIEW,
		});
	}
}
