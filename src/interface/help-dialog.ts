import { BoxElement } from '../types/types';
import { HELP_TEXT } from '../util/help-text';
import { getPageableBoxElement } from './interface-elements';

let helpDialog: BoxElement;

export const getHelpDialog = () => {
	if (helpDialog) {
		return helpDialog;
	}

	helpDialog = getPageableBoxElement({
		alwaysScroll: true,
		bottom: 1,
		content: HELP_TEXT,
		keys: true,
		left: 0,
		name: 'helpDialog',
		right: 0,
		scrollable: true,
		top: 0,
		vi: true,
	});

	helpDialog.hide();

	return helpDialog;
};
