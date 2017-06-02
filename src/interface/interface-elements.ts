import * as Blessed from 'blessed';
import {
	BoxElement,
	BoxOptions,
	IListElement,
	KeyEvent,
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

export function getCommitListElement(
	onKeyPressFn: (ch: string, key: KeyEvent) => void): IListElement {

	const list: IListElement = getListElement();

	list.on('keypress', onKeyPressFn);

	return list;
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

/*
Helper Functions
*/

function getListElement(): IListElement {
	const listBgColor: string = '#555';

	return Blessed.list({
		bottom: 0,
		left: 0,
		mouse: true,
		right: 0,
		style: {
			selected: {
				bg: listBgColor,
			},
		},
		tags: true,
		top: 0,
	});
}
