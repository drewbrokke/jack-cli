import { store } from '../redux/store';
import { Screen } from '../types/types';
import { stash } from '../util/stash';
import { getCommitElement } from './commit-view';
import { getHelpPrompt } from './help-prompt';
import { getScreenElement } from './interface-elements';
import { getCommitListElement } from './list-view';
import {
	getNotificationContainer,
	notifyError,
	notifyInfo,
	notifySuccess,
	notifyWarning,
	toggleHelp,
} from './notification';
import { getProgressIndicator } from './progress-indicator';

const ANCHOR_COMMIT = 'ANCHOR_COMMIT';

import {
	cherryPickCommit,
	copyCommitMessageToClipboard,
	copySHAToClipboard,
	openCommitRangeDiffFile,
	openFilesFromCommit,
	openSingleCommitDiffFile,
	sortSHAs,
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

		if (stash.has(ANCHOR_COMMIT) && stash.get(ANCHOR_COMMIT) === commit) {
			unmarkAnchorCommit();
		} else {
			stash.set(ANCHOR_COMMIT, commit);

			notifyInfo(`Marked commit for diffing: ${commit}`);

		}
	});

	screen.key('c', () => {
		const SHA = getSHA();
		notifyInfo(`Attempting to cherry-pick commit ${SHA}`);
		cherryPickCommit(getSHA())
			.then(() => notifySuccess(`Successfully cherry-picked commit ${SHA}`))
			.catch((errorMessage) => notifyError(`Unable to cherry-pick commit ${SHA}:\n\n${errorMessage}\n\nAborting cherry-pick.`));
	});

	screen.key('d', () => {
		if (!stash.has(ANCHOR_COMMIT)) {
			return notifyWarning('You must first mark an anchor commit for diffing with the "x" key');
		}

		sortSHAs(stash.get(ANCHOR_COMMIT), getSHA())
			.then(([ancestorSHA, childSHA]) => screen.spawn('git', ['diff', `${ancestorSHA}^..${childSHA}`], {}))
			.then(unmarkAnchorCommit)
			.catch((errorMessage) => notifyError(`Could not get diff:\n\n${errorMessage}`));
	});

	screen.key('e', () => {
		if (stash.has(ANCHOR_COMMIT)) {
			sortSHAs(stash.get(ANCHOR_COMMIT), getSHA())
				.then(([ancestorSHA, childSHA]) => openCommitRangeDiffFile(ancestorSHA, childSHA))
				.then(unmarkAnchorCommit)
				.catch((errorMessage) => notifyError(`Could not open diff:\n\n${errorMessage}`));
		} else {
			openSingleCommitDiffFile(getSHA())
				.catch((errorMessage) => notifyError(`Could not open diff:\n\n${errorMessage}`));
		}
	});

	screen.key('i', () =>
		screen.exec(
			'git', ['rebase', '-i', `${getSHA()}^`], {},
			() => process.exit(0)));

	screen.key('m', () => {
		copyCommitMessageToClipboard(getSHA())
			.then((message) => notifySuccess(`Copied commit message to the clipoard:\n"${message}"`))
			.catch((errorMessage) => notifyError(`Could not copy the commit message to the clipboard:\n\n${errorMessage}`));
	});

	screen.key('n', () => {
		if (!stash.has(ANCHOR_COMMIT)) {
			return notifyWarning('You must first mark an anchor commit for diffing with the "x" key');
		}

		sortSHAs(stash.get(ANCHOR_COMMIT), getSHA())
			.then(([ancestorSHA, childSHA]) => screen.spawn('git', ['diff', `${ancestorSHA}^..${childSHA}`, '--name-only'], {}))
			.then(unmarkAnchorCommit)
			.catch((errorMessage) => notifyError(`Could not get diff list:;\n\n${errorMessage}`));
	});

	screen.key('o', () => {
		openFilesFromCommit(getSHA())
			.catch((errorMessage) => notifyError(`Could not open the files:\n\n${errorMessage}`));
	});

	screen.key('y', () => {
		const SHA = getSHA();

		copySHAToClipboard(SHA)
			.then(() => notifySuccess(`Copied SHA to the clipboard: ${SHA}`))
			.catch((errorMessage) => notifyError(`Could not copy the SHA to the clipboard:\n\n${errorMessage}`));
	});

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

const unmarkAnchorCommit = () => {
	stash.delete(ANCHOR_COMMIT);

	notifyInfo(`Unmarked commit`);
};

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
