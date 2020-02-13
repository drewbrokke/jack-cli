import * as Blessed from 'blessed';
import {
	BoxElement,
	BoxOptions,
	ListElement,
	ListOptions,
	Screen,
	ScreenOptions,
	TextElement,
	TextOptions,
} from '../types/types';

export const getBoxElement = (options: BoxOptions): BoxElement =>
	Blessed.box(options);

export const getPageableBoxElement = (options: BoxOptions): BoxElement => {
	const element = getBoxElement(options);

	element.key(['f', 'pagedown'], () => {
		element.scroll(+element.height);
		element.screen.render();
	});
	element.key(['b', 'pageup'], () => {
		element.scroll(-element.height);
		element.screen.render();
	});

	return element;
};

export const getListElement = (options: ListOptions): ListElement =>
	Blessed.list(options);

export const getScreenElement = (options: ScreenOptions): Screen =>
	Blessed.screen(options) as Screen;

export const getTextElement = (options: TextOptions): TextElement =>
	Blessed.text(options);
