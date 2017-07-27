import { store } from '../redux/store';
import { Screen } from '../types/types';
import { getCommitElement } from './commit-view';
import { getHelpPrompt } from './help-prompt';
import { getScreenElement } from './interface-elements';
import { getCommitListElement } from './list-view';
import { getNotificationContainer, toggleHelp } from './notification';
import { getProgressIndicator } from './progress-indicator';

import { cherryPickCommit, copySHAToClipboard, openFilesFromCommit } from '../util/commands';

export function getScreen(): Screen {
	const screen: Screen = getScreenElement({
		autoPadding: true,
		smartCSR: true,
	});

	screen.key('?', toggleHelp);
	screen.key('c', () => cherryPickCommit(getSHA()));
	screen.key('i', () =>
		screen.exec(
			'git', ['rebase', '-i', `${getSHA()}^`], {},
			() => process.exit(0)));
	screen.key('o', () => openFilesFromCommit(getSHA()));
	screen.key('y', () => copySHAToClipboard(getSHA()));
	screen.key(['C-c', 'q', 'escape'], () => process.exit(0));

	const commitElement = getCommitElement();
	const commitListElement = getCommitListElement();

	screen.append(commitElement);
	screen.append(commitListElement);
	screen.append(getHelpPrompt());
	screen.append(getProgressIndicator());
	screen.append(getNotificationContainer());

	store.subscribe(updateView(screen, commitElement, commitListElement));

	return screen;
}

const updateView = (screen, commitElement, commitListElement) => () => {
	const state = store.getState();

	if (state.view === 'LIST' && screen.focused !== commitListElement) {
		commitElement.setBack();
		commitListElement.focus();

		return screen.render();
	}

	if (state.view === 'COMMIT' && screen.focused !== commitElement) {
		commitListElement.setBack();
		commitElement.focus();

		return screen.render();
	}
};

function getSHA(): string {
	return store.getState().SHA;
}
