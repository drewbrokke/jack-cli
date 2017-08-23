import { store } from '../redux/store';
import { IScreen } from '../types/types';
import {
	copyCommitMessageToClipboard,
	copySHAToClipboard,
	openCommitRangeDiffFile,
	openFilesFromCommit,
	openSingleCommitDiffFile,
} from '../util/external-commands';
import {
	gitCherryPick,
	gitCherryPickAbort,
	sortSHAs,
} from '../util/git-util';
import { stash } from '../util/stash';
import { getHelpDialog, toggleHelp } from './help-dialog';
import { getScreenElement } from './interface-elements';
import { getMainContentContainer } from './main-content-container';
import {
	getNotificationContainer,
	notifyError,
	notifyInfo,
	notifySuccess,
	notifyWarning,
} from './notification';
import { getStatusBar } from './status-bar';

const ANCHOR_COMMIT = 'ANCHOR_COMMIT';

export const getScreen = (): IScreen => {
	const screen: IScreen = getScreenElement({
		autoPadding: true,
		smartCSR: true,
	});

	screen._listenedMouse = true;

	screen.key('?', toggleHelp);

	screen.key('c', async () => {
		const SHA = getSHA();

		notifyInfo(`Attempting to cherry-pick commit ${SHA}`);

		try {
			await gitCherryPick(SHA);

			notifySuccess(`Successfully cherry-picked commit ${SHA}`);
		} catch (errorMessage) {
			notifyError(`Unable to cherry-pick commit ${SHA}:\n\n${errorMessage}\n\nAborting cherry-pick.`);

			gitCherryPickAbort();
		}
	});

	screen.key('d', async () => {
		if (!stash.has(ANCHOR_COMMIT)) {
			return notifyWarning('You must first mark an anchor commit for diffing with the "x" key');
		}

		try {
			const [ancestorSHA, childSHA] = await sortSHAs(stash.get(ANCHOR_COMMIT), getSHA());

			screen.spawn('git', ['diff', `${ancestorSHA}^..${childSHA}`], {});
		} catch (errorMessage) {
			notifyError(`Could not get diff:\n\n${errorMessage}`);
		}

		unmarkAnchorCommit();
	});

	screen.key('e', async () => {
		try {
			if (stash.has(ANCHOR_COMMIT)) {
				const [ancestorSHA, childSHA] = await sortSHAs(stash.get(ANCHOR_COMMIT), getSHA());

				await openCommitRangeDiffFile(ancestorSHA, childSHA);
			} else {

				await openSingleCommitDiffFile(getSHA());
			}
		} catch (errorMessage) {
			notifyError(`Could not open diff:\n\n${errorMessage}`);
		}

		if (stash.has(ANCHOR_COMMIT)) {
			unmarkAnchorCommit();
		}
	});

	screen.key('i', () =>
		screen.exec(
			'git', ['rebase', '-i', `${getSHA()}^`], {},
			() => process.exit(0)));

	screen.key('m', async () => {
		try {
			const message = await copyCommitMessageToClipboard(getSHA());

			notifySuccess(`Copied commit message to the clipoard:\n"${message}"`);
		} catch (errorMessage) {
			notifyError(`Could not copy the commit message to the clipboard:\n\n${errorMessage}`);
		}
	});

	screen.key('n', async () => {
		if (!stash.has(ANCHOR_COMMIT)) {
			return notifyWarning('You must first mark an anchor commit for diffing with the "x" key');
		}

		try {
			const [ancestorSHA, childSHA] = await sortSHAs(stash.get(ANCHOR_COMMIT), getSHA());

			screen.spawn('git', ['diff', `${ancestorSHA}^..${childSHA}`, '--name-only'], {});
		} catch (errorMessage) {
			notifyError(`Could not get diff list:;\n\n${errorMessage}`);
		}

		unmarkAnchorCommit();
	});

	screen.key('o', async () => {
		try {
			await openFilesFromCommit(getSHA());
		} catch (errorMessage) {
			notifyError(`Could not open the files:\n\n${errorMessage}`);
		}
	});

	screen.key('x', () => {
		const commit = getSHA();

		if (stash.has(ANCHOR_COMMIT) && stash.get(ANCHOR_COMMIT) === commit) {
			unmarkAnchorCommit();
		} else {
			stash.set(ANCHOR_COMMIT, commit);

			notifyInfo(`Marked commit for diffing: ${commit}`);

		}
	});

	screen.key('y', async () => {
		const SHA = getSHA();

		try {
			await copySHAToClipboard(SHA);

			notifySuccess(`Copied SHA to the clipboard: ${SHA}`);
		} catch (errorMessage) {
			notifyError(`Could not copy the SHA to the clipboard:\n\n${errorMessage}`);
		}
	});

	screen.key(['C-c', 'q', 'escape'], () => process.exit(0));

	screen.append(getMainContentContainer());
	screen.append(getStatusBar());
	screen.append(getNotificationContainer());
	screen.append(getHelpDialog());

	return screen;
};

const getSHA = (): string => {
	return store.getState().SHA;
};

const unmarkAnchorCommit = () => {
	stash.delete(ANCHOR_COMMIT);

	notifyInfo(`Unmarked commit`);
};
