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

export function constructProgressText(
	index: number = 0, total: number = 0): string {

	return `Line ${index + 1}/${total}`;
}
