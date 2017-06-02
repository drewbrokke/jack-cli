import * as Blessed from 'blessed';
import {
	BoxElement,
	BoxOptions,
	IListElement,
	ListOptions,
	Screen,
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

export function getScreenElement(options: ScreenOptions): Screen {
	return Blessed.screen(options);
}

export function getTextElement(options: TextOptions): TextElement {
	return Blessed.text(options);
}
