import { store } from '../redux/store';
import { Screen } from '../types/types';
import { stash } from '../util/stash';
import { getCommitElement } from './commit-view';
import { getHelpPrompt } from './help-prompt';
import { getScreenElement } from './interface-elements';
import { getCommitListElement } from './list-view';
import {
	getNotificationContainer,
	notifyInfo,
	notifyWarning,
	toggleHelp,
} from './notification';
import { getProgressIndicator } from './progress-indicator';

const ANCHOR_COMMIT = 'ANCHOR_COMMIT';

import {
	cherryPickCommit,
	copyCommitMessageToClipboard,
	copySHAToClipboard,
	getParentChildObject,
	openFilesFromCommit,
} from '../util/commands';

export function getScreen(): Screen {
	const screen: Screen = getScreenElement({
		autoPadding: true,
		smartCSR: true,
	});

	screen._listenedMouse = true;

	screen.key('?', toggleHelp);
	screen.key('x', () => {
		const commit = getSHA();

		stash.set(ANCHOR_COMMIT, commit);

		notifyInfo(`Marked commit for diffing: ${commit}`);
	});
	screen.key('c', () => cherryPickCommit(getSHA()));
	screen.key('d', () => doDiff((ancestorSHA, childSHA) =>
		screen.spawn('git', ['diff', `${ancestorSHA}^..${childSHA}`], {})));
	screen.key('i', () =>
		screen.exec(
			'git', ['rebase', '-i', `${getSHA()}^`], {},
			() => process.exit(0)));
	screen.key('m', () => copyCommitMessageToClipboard(getSHA()));
	screen.key('n', () => doDiff((ancestorSHA, childSHA) =>
		screen.spawn('git', ['diff', `${ancestorSHA}^..${childSHA}`, '--name-only'], {})));
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

const doDiff = (callback: (ancestorSHA: string, childSHA: string) => void): void => {
	const currentCommit = getSHA();

	if (stash.has(ANCHOR_COMMIT)) {
		const anchorCommit = stash.get(ANCHOR_COMMIT);

		getParentChildObject(anchorCommit, currentCommit)
			.then(({ancestor, child}) => {
				callback(ancestor, child);

				stash.delete(ANCHOR_COMMIT);
			})
			.catch(() => {
				stash.delete(ANCHOR_COMMIT);
			});
	} else {
		notifyWarning('You must first mark an anchor commit for diffing with the "x" key');
	}
};

function getSHA(): string {
	return store.getState().SHA;
}
