import * as Blessed from 'blessed';
import { COMMIT_ELEMENT_SEPARATOR } from './git-util';
import {
	BoxElement,
	IListElement,
	KeyEvent,
	Screen,
	TextElement,
 } from './types';

export function constructProgressText(
	index: number = 0, total: number = 0): string {

	return `Commit ${total - index}/${total}`;
}

export function getCommitListElement(
	items: string[], onSelectFn: (item: BoxElement, index: number) => void,
	onKeyPressFn: (ch: string, key: KeyEvent) => void): IListElement {

	const list: IListElement = getListElement();

	list.on('select', onSelectFn);
	list.on('keypress', onKeyPressFn);

	list.setItems(items.map(addColorsToItem));

	return list;
}

export function getBoxElement(
	{ top = 0, right = 0, bottom = 0, left = 0, content = ''},
	onKeyFn: (ch: string, key: KeyEvent) => void): BoxElement {

	const box: BoxElement = Blessed.box({
		bottom,
		content,
		left,
		mouse: true,
		right,
		scrollable: true,
		scrollbar: true,
		top,
	});

	box.on('keypress', onKeyFn);

	return box;
}

export function getScreenElement(): Screen {
	const screen = Blessed.screen();

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

function addColorsToItem(item: string) {
	const [sha, message, time, author] = item.split(COMMIT_ELEMENT_SEPARATOR);

	return [
		`{red-fg} ${sha} -`,
		`{white-fg}${message}`,
		`{green-fg}${time}`,
		`{blue-fg}${author}`,
		`{/}`,
	].join(' ');
}

function getListElement(): IListElement {
	const listBgColor: string = '#555';

	return Blessed.list({
		bottom: 0,
		keys: true,
		left: 0,
		mouse: true,
		right: 0,
		style: {
			item: {
				hover: {
					bg: listBgColor,
				},
			},
			selected: {
				bg: listBgColor,
			},
		},
		tags: true,
		top: 0,
		vi: true,
	});
}
