import { BoxElement } from '../types/types';
import { getBoxElement, getTextElement } from './interface-elements';
import { getLogCompletedStatus } from './log-completed-status';
import { getProgressIndicator } from './progress-indicator';

let statusBar: BoxElement;

export const getStatusBar = (): BoxElement => {
	statusBar = getBoxElement({
		bottom: 0,
		height: 1,
		name: 'statusBar',
		right: 0,
		shrink: true,
		width: '100%',
	});

	statusBar.append(getProgressIndicator());
	statusBar.append(getLogCompletedStatus());
	statusBar.append(
		getTextElement({ content: 'Press "?" to show/hide help.', right: 0 }),
	);

	return statusBar;
};
