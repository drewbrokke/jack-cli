import {
	TextElement,
	TextOptions,
} from '../types/types';
import { helpText } from '../util/help-text';
import { getTextElement } from './interface-elements';

let helpDialog: TextElement;

export const getHelpDialog = () => {
	if (helpDialog) {
		return helpDialog;
	}

	const options: TextOptions = {
		border: 'line',
		content: helpText,
		padding: {
			bottom: 0,
			left: 1,
			right: 1,
			top: 0,
		},
		right: 0,
		shrink: true,
		tags: true,
		top: 0,
	};

	helpDialog = getTextElement(options);

	helpDialog.hide();

	return helpDialog;
};

export const toggleHelp = () => {
	helpDialog.toggle();

	helpDialog.screen.render();
};
