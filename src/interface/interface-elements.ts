import * as Blessed from 'blessed';
import {
	BoxElement,
	BoxOptions,
	IListElement,
	IScreen,
	ListOptions,
	ScreenOptions,
	TextElement,
	TextOptions,
} from '../types/types';

export const getBoxElement = (options: BoxOptions): BoxElement =>
	Blessed.box(options);

export const getListElement = (options: ListOptions): IListElement =>
	Blessed.list(options);

export const getScreenElement = (options: ScreenOptions): IScreen =>
	Blessed.screen(options) as IScreen;

export const getTextElement = (options: TextOptions): TextElement =>
	Blessed.text(options);
