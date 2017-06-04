import {
	TextElement,
 } from '../types/types';
import { getTextElement } from './interface-elements';

let helpPrompt: TextElement;

export function getHelpPrompt(): TextElement {
	if (helpPrompt) {
		return helpPrompt;
	}

	helpPrompt = getTextElement({
		border: 'line',
		content: 'Press "?" to show/hide help.',
		fill: true,
		right: 0,
		shrink: true,
		top: 0,
	});

	return helpPrompt;
}
