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
		content: 'Press "?" to show/hide help.',
		right: 0,
	});

	return helpPrompt;
}
