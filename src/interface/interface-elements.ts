import * as Blessed from 'blessed';
import {
	IListElement,
	KeyEvent,
	Screen,
	ScrollableTextElement,
	ScrollableTextOptions,
	TextElement,
 } from '../types/types';

export function constructProgressText(
	index: number = 0, total: number = 0): string {

	return `Line ${index + 1}/${total}`;
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

export function getScreenElement(): Screen {
	const screen = Blessed.screen({
		smartCSR: true,
	});

	screen.key(['C-c', 'q', 'escape'], () => process.exit(0));

	return screen;
}

export function getTextElement(content: string): TextElement {
	return Blessed.text({
		border: 'line',
		content,
		fill: true,
		right: 0,
		shrink: true,
		top: 0,
	});
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
