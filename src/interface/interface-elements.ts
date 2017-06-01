import * as Blessed from 'blessed';
import {
	BoxElement,
	IListElement,
	KeyEvent,
	Screen,
	TextElement,
 } from '../types/types';
import { COMMIT_ELEMENT_SEPARATOR } from '../util/git-util';

export function constructProgressText(
	index: number = 0, total: number = 0): string {

	return `Commit ${index + 1}/${total}`;
}

export function getCommitListElement(
	onKeyPressFn: (ch: string, key: KeyEvent) => void): IListElement {

	const list: IListElement = getListElement();

	list.on('keypress', onKeyPressFn);

	return list;
}

export function getBoxElement(
	{ top = 0, right = 0, bottom = 0, left = 0},
	onKeyFn: (ch: string, key: KeyEvent) => void): BoxElement {

	const box: BoxElement = Blessed.box({
		bottom,
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

export function addColorsToItem(item: string) {
	const [sha, message, time, author] = item.split(COMMIT_ELEMENT_SEPARATOR);

	return [
		`{red-fg} ${sha}`,
		`{white-fg}- ${message}`,
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
			selected: {
				bg: listBgColor,
			},
		},
		tags: true,
		top: 0,
		vi: true,
	});
}
