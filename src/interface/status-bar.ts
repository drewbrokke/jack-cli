import { BoxElement } from '../types/types';
import { getHelpPrompt } from "./help-prompt";
import { getBoxElement } from './interface-elements';
import { getProgressIndicator } from './progress-indicator';

let statusBar: BoxElement;

export function getStatusBar(): BoxElement {
	statusBar = getBoxElement({
		// bg: '#006680',
		bottom: 0,
		height: 1,
		right: 0,
		shrink: true,
		width: '100%',
	});

	statusBar.append(getProgressIndicator());
	statusBar.append(getHelpPrompt());

	return statusBar;
}
