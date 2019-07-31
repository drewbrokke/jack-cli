import * as Blessed from 'blessed';

// Type Aliases

export type BlessedElement = Blessed.Widgets.BlessedElement;
export type BoxElement = Blessed.Widgets.BoxElement;
export type BoxOptions = Blessed.Widgets.BoxOptions;
export type ListElementStyle = Blessed.Widgets.ListElementStyle;
export type ListOptions = Blessed.Widgets.ListOptions<ListElementStyle>;
export type ScreenOptions = Blessed.Widgets.IScreenOptions;
export type TextElement = Blessed.Widgets.TextElement;
export type TextOptions = Blessed.Widgets.TextOptions;

export interface ListElement extends Blessed.Widgets.ListElement {
	getItemIndex(items: BlessedElement | string): number;
	setItems(items: BlessedElement[] | string[]): void;
}

export interface Screen extends Blessed.Widgets.Screen {
	_listenedMouse: boolean;
}

// Custom Types

export enum ActionType {
	ADD_COMMITS = 'ADD_COMMITS',
	MARK_SHA = 'MARK_SHA',
	CLEAR_LOG = 'CLEAR_LOG',
	NEXT_SEARCH_RESULT = 'NEXT_SEARCH_RESULT',
	PREVIOUS_SEARCH_RESULT = 'PREVIOUS_SEARCH_RESULT',
	UPDATE_INDEX = 'UPDATE_INDEX',
	UPDATE_SEARCH = 'UPDATE_SEARCH',
	UPDATE_STATUS = 'UPDATE_STATUS',
	UPDATE_VIEW = 'UPDATE_VIEW',
}

export enum Status {
	RETRIEVING_LOG = 'RETRIEVING_LOG',
	LOG_COMPLETED = 'LOG_COMPLETED',
	LOG_STALE = 'LOG_STALE',
}

export enum View {
	COMMIT = 'COMMIT',
	LIST = 'LIST',
}

export interface Action {
	type: ActionType;
	payload?: any;
}

export type StateProperty =
	| 'index'
	| 'indexesWithSHAs'
	| 'indexesMatchingSearch'
	| 'lines'
	| 'search'
	| 'status'
	| 'markedSHA'
	| 'SHA'
	| 'view'
	| 'visibleLines';

export interface State {
	readonly index: number;
	readonly indexesMatchingSearch: ReadonlyArray<number>;
	readonly indexesWithSHAs: ReadonlyArray<number>;
	readonly lines: ReadonlyArray<string>;
	readonly search: string;
	readonly status: Status;
	readonly markedSHA: string | null;
	readonly SHA: string;
	readonly view: View;
	readonly visibleLines: ReadonlyArray<string>;
}

export interface SearchIndex {
	clearIndex(): void;
	indexLine(id: number, line: string): void;
	search(searchTerm: string): Promise<number[]>;
}

export interface UpdateFunctionArgumentObject<T extends BlessedElement> {
	element: T;
	lastState: State;
	state: State;
}

export type UpdateFunction<T extends BlessedElement> = (
	argumentObject: UpdateFunctionArgumentObject<T>,
) => Promise<boolean>;
