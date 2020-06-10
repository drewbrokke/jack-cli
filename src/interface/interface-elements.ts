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
import { keys } from '../util/keys-def';

export const getBoxElement = (options: BoxOptions): BoxElement =>
	Blessed.box(options);

export const getPageableBoxElement = (options: BoxOptions): BoxElement => {
	const element = getBoxElement(options);

	element.key([keys.F, keys.PAGEDOWN], () => {
		element.scroll(+element.height);
		element.screen.render();
	});
	element.key([keys.B, keys.PAGEUP], () => {
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
