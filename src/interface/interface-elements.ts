import * as Blessed from 'blessed';
import {
	BoxElement,
	BoxOptions,
	IListElement,
	IScreen,
	ListOptions,
	ScreenOptions,
	ScrollableTextElement,
	ScrollableTextOptions,
	TextElement,
	TextOptions,
 } from '../types/types';

export function getBoxElement(options: BoxOptions): BoxElement {
	return Blessed.box(options);
}

export function getListElement(options: ListOptions): IListElement {
	return Blessed.list(options);
}

export function getScrollableTextElement(
	options: ScrollableTextOptions): ScrollableTextElement {

	return Blessed.scrollabletext(options);
}

export function getScreenElement(options: ScreenOptions): IScreen {
	return Blessed.screen(options) as IScreen;
}

export function getTextElement(options: TextOptions): TextElement {
	return Blessed.text(options);
}
