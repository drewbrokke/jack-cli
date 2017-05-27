import * as Blessed from 'blessed';

export type BlessedElement = Blessed.Widgets.BlessedElement;
export type BoxElement = Blessed.Widgets.BoxElement;
export type KeyEvent = Blessed.Widgets.Events.IKeyEventArg;
export type Node = Blessed.Widgets.Node;
export type Screen = Blessed.Widgets.Screen;
export type TextElement = Blessed.Widgets.TextElement;

export interface IListElement extends Blessed.Widgets.ListElement {
	selected?: number;

	enterSelected?(): void;
	pushItem(child: BlessedElement | string): number;
	setItems(items: BlessedElement[] | string[]): void;
}
