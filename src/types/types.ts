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
	UPDATE_INDEX = 'UPDATE_INDEX',
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

export enum StateProperty {
	index = 'index',
	indexesWithSHAs = 'indexesWithSHAs',
	lines = 'lines',
	status = 'status',
	markedSHA = 'markedSHA',
	SHA = 'SHA',
	view = 'view',
}

// tslint:disable-next-line:interface-name
export interface State {
	[StateProperty.index]: number;
	[StateProperty.indexesWithSHAs]: number[];
	[StateProperty.lines]: string[];
	[StateProperty.status]: Status;
	[StateProperty.markedSHA]: string | null;
	[StateProperty.SHA]: string;
	[StateProperty.view]: View;
}

export interface UpdateFunctionArgumentObject<T extends BlessedElement> {
	element: T;
	lastState: State;
	modifiedProperties: StateProperty[];
	state: State;
}

export type UpdateFunction<T extends BlessedElement> = (
	argumentObject: UpdateFunctionArgumentObject<T>,
) => Promise<boolean>;
