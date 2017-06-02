import {
	TextElement,
 } from '../types/types';
import { getTextElement } from './interface-elements';

export function getProgressIndicator(content: string): TextElement {
	return getTextElement({
		border: 'line',
		content,
		fill: true,
		right: 0,
		shrink: true,
		top: 0,
	});
}
