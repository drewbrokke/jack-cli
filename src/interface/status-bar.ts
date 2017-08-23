import { BoxElement } from '../types/types';
import { getBoxElement, getTextElement } from './interface-elements';
import { getProgressIndicator } from './progress-indicator';

let statusBar: BoxElement;

export function getStatusBar(): BoxElement {
	statusBar = getBoxElement({
		bottom: 0,
		height: 1,
		right: 0,
		shrink: true,
		width: '100%',
	});

	statusBar.append(getProgressIndicator());
	statusBar.append(getTextElement({ content: 'Press "?" to show/hide help.', right: 0 }));

	return statusBar;
}
