import * as Blessed from 'blessed';

export type BlessedElement = Blessed.Widgets.BlessedElement;
export type BoxElement = Blessed.Widgets.BoxElement;
export type BoxOptions = Blessed.Widgets.BoxOptions;
export type KeyEvent = Blessed.Widgets.Events.IKeyEventArg;
export type ListOptions = Blessed.Widgets.ListOptions<BoxOptions>;
export type Node = Blessed.Widgets.Node;
export type Screen = Blessed.Widgets.Screen;
export type TextElement = Blessed.Widgets.TextElement;
export type TextOptions = Blessed.Widgets.TextOptions;

export interface IListElement extends Blessed.Widgets.ListElement {
	selected?: number;

	enterSelected?(): void;
	pushItem(child: BlessedElement | string): number;
	setItems(items: BlessedElement[] | string[]): void;
}


export type View = 'COMMIT' | 'LIST';

export type ActionType =
	'ADD_COMMITS' |
	'DECREMENT_INDEX' |
	'INCREMENT_INDEX' |
	'NEXT_COMMIT' |
	'PREVIOUS_COMMIT' |
	'VIEW_COMMIT' |
	'VIEW_LIST';

export interface IState {
	view: View;
	split: boolean;
	index: number;
	commits: string[];
	content: string;
}

export interface IAction {
	type: ActionType;
	payload?: any;
}
