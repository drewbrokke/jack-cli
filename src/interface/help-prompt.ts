import {
	TextElement,
 } from '../types/types';
import { getTextElement } from './interface-elements';

export function getHelpPrompt(): TextElement {
	return getTextElement({
		border: 'line',
		content: 'Press "?" to show/hide help.',
		fill: true,
		right: 0,
		shrink: true,
		top: 0,
	});
}
