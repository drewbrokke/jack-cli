import * as Blessed from 'blessed';

// Type Aliases

export type BlessedElement = Blessed.Widgets.BlessedElement;
export type BoxElement = Blessed.Widgets.BoxElement;
export type BoxOptions = Blessed.Widgets.BoxOptions;
export type KeyEvent = Blessed.Widgets.Events.IKeyEventArg;
export type ListElementStyle = Blessed.Widgets.ListElementStyle;
export type ListOptions = Blessed.Widgets.ListOptions<ListElementStyle>;
export type Node = Blessed.Widgets.Node;
export type ScreenOptions = Blessed.Widgets.IScreenOptions;
export type ScrollableTextElement = Blessed.Widgets.ScrollableTextElement;
export type ScrollableTextOptions = Blessed.Widgets.ScrollableTextOptions;
export type TextElement = Blessed.Widgets.TextElement;
export type TextOptions = Blessed.Widgets.TextOptions;

export interface IListElement extends Blessed.Widgets.ListElement {
	getItemIndex(items: BlessedElement | string): number;
	setItems(items: BlessedElement[] | string[]): void;
}

export interface IScreen extends Blessed.Widgets.Screen {
	_listenedMouse: boolean;
}

// Custom Types

export enum ActionType {
	ADD_COMMITS = 'ADD_COMMITS',
	MARK_SHA = 'MARK_SHA',
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

export interface IAction {
	type: ActionType;
	payload?: any;
}

export interface IState {
	index: number;
	indexesWithSHAs: number[];
	lines: string[];
	status: Status;
	markedSHA: string | null;
	SHA: string;
	split: boolean;
	view: View;
}
