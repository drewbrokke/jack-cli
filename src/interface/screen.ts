import { store } from '../redux/store';
import { Screen } from '../types/types';
import { getCommitElement } from './commit-view';
import { getHelpPrompt } from './help-prompt';
import { getScreenElement } from './interface-elements';
import { getCommitListElement } from './list-view';
import { getNotificationContainer, toggleHelp } from './notification';
import { getProgressIndicator } from './progress-indicator';

import { cherryPickCommit, copySHAToClipboard, openFilesFromCommit } from '../util/commands';

let screen: Screen;

export function getScreen(): Screen {
	if (screen) {
		return screen;
	}

	screen = getScreenElement({
		autoPadding: true,
		smartCSR: true,
	});

	screen.key('?', toggleHelp);
	screen.key('c', () => cherryPickCommit(getSHA()));
	screen.key('o', () => openFilesFromCommit(getSHA()));
	screen.key('y', () => copySHAToClipboard(getSHA()));
	screen.key(['C-c', 'q', 'escape'], () => process.exit(0));

	screen.append(getCommitElement());
	screen.append(getCommitListElement());
	screen.append(getHelpPrompt());
	screen.append(getProgressIndicator());
	screen.append(getNotificationContainer());

	return screen;
}

function getSHA(): string {
	return store.getState().SHA;
}
