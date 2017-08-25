import { store } from '../redux/store';
import { IScreen } from '../types/types';
import {
	copyCommitMessageToClipboard,
	copySHAToClipboard,
	openCommitRangeDiffFile,
	openFilesFromCommit,
	openFilesFromCommitRange,
	openSingleCommitDiffFile,
} from '../util/external-commands';
import {
	gitCherryPick,
	gitCherryPickAbort,
	sortSHAs,
} from '../util/git-util';
import { KEY_ANCHOR_COMMIT, stash } from '../util/stash';
import { getHelpDialog, toggleHelp } from './help-dialog';
import { getScreenElement } from './interface-elements';
import { getMainContentContainer } from './main-content-container';
import {
	getNotificationContainer,
	notifyError,
	notifyInfo,
	notifySuccess,
} from './notification';
import { getStatusBar } from './status-bar';

export const getScreen = (): IScreen => {
	const screen: IScreen = getScreenElement({
		autoPadding: true,
		smartCSR: true,
	});

	screen._listenedMouse = true;

	screen.key('?', toggleHelp);

	screen.key('S-c', async () => {
		const SHA = getSHA();

		notifyInfo(`Attempting to cherry-pick commit ${SHA}`);

		try {
			await gitCherryPick(SHA);

			notifySuccess(`Successfully cherry-picked commit ${SHA}`);
		} catch (errorMessage) {
			notifyError(
`Unable to cherry-pick commit ${SHA}:

${errorMessage}

Aborting cherry-pick.`);

			gitCherryPickAbort();
		}
	});

	screen.key('d', async () => {
		const SHA = getSHA();

		try {
			if (stash.has(KEY_ANCHOR_COMMIT)) {
				const [ancestorSHA, childSHA] =
					await sortSHAs(stash.get(KEY_ANCHOR_COMMIT), SHA);

				spawnDiff(screen, ancestorSHA, childSHA);
			} else {
				spawnDiff(screen, SHA, SHA);
			}
		} catch (errorMessage) {
			notifyError(`Could not get diff:\n\n${errorMessage}`);
		}

		if (stash.has(KEY_ANCHOR_COMMIT)) {
			unmarkAnchorCommit();
		}
	});

	screen.key('e', async () => {
		try {
			if (stash.has(KEY_ANCHOR_COMMIT)) {
				const [ancestorSHA, childSHA] =
					await sortSHAs(stash.get(KEY_ANCHOR_COMMIT), getSHA());

				await openCommitRangeDiffFile(ancestorSHA, childSHA);
			} else {
				await openSingleCommitDiffFile(getSHA());
			}
		} catch (errorMessage) {
			notifyError(`Could not open diff:\n\n${errorMessage}`);
		}

		if (stash.has(KEY_ANCHOR_COMMIT)) {
			unmarkAnchorCommit();
		}
	});

	screen.key('S-i', () =>
		screen.exec(
			'git', ['rebase', '-i', `${getSHA()}^`], {},
			() => process.exit(0)));

	screen.key('m', async () => {
		try {
			const message = await copyCommitMessageToClipboard(getSHA());

			notifySuccess(`Copied commit message to the clipoard:\n\n"${message}"`);
		} catch (errorMessage) {
			notifyError(
`Could not copy the commit message to the clipboard:

${errorMessage}`);
		}
	});

	screen.key('n', async () => {
		const SHA = getSHA();

		try {
			if (stash.has(KEY_ANCHOR_COMMIT)) {
				const [ancestorSHA, childSHA] =
					await sortSHAs(stash.get(KEY_ANCHOR_COMMIT), SHA);

				spawnDiffNameOnly(screen, ancestorSHA, childSHA);
			} else {
				spawnDiffNameOnly(screen, SHA, SHA);
			}
		} catch (errorMessage) {
			notifyError(`Could not get diff list:;\n\n${errorMessage}`);
		}

		if (stash.has(KEY_ANCHOR_COMMIT)) {
			unmarkAnchorCommit();
		}
	});

	screen.key('o', async () => {
		const SHA = getSHA();

		try {
			if (stash.has(KEY_ANCHOR_COMMIT)) {
				const [ancestorSHA, childSHA] =
					await sortSHAs(stash.get(KEY_ANCHOR_COMMIT), SHA);

				await openFilesFromCommitRange(ancestorSHA, childSHA);
			} else {
				await openFilesFromCommit(getSHA());
			}
		} catch (errorMessage) {
			notifyError(`Could not open the files:\n\n${errorMessage}`);
		}

		if (stash.has(KEY_ANCHOR_COMMIT)) {
			unmarkAnchorCommit();
		}
	});

	screen.key('x', () => {
		const commit = getSHA();

		if (stash.has(KEY_ANCHOR_COMMIT) && stash.get(KEY_ANCHOR_COMMIT) === commit) {
			unmarkAnchorCommit();
		} else {
			stash.set(KEY_ANCHOR_COMMIT, commit);

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

const spawnDiff = (screen: IScreen, SHA1: string, SHA2: string) =>
	screen.spawn(
		'git',
		['diff', `${SHA1}^..${SHA2}`, '--patch', '--stat-width=1000'], {});

const spawnDiffNameOnly = (screen: IScreen, SHA1: string, SHA2: string) =>
	screen.spawn('git', ['diff', `${SHA1}^..${SHA2}`, '--name-only'], {});

const unmarkAnchorCommit = () => {
	stash.delete(KEY_ANCHOR_COMMIT);

	notifyInfo(`Unmarked commit`);
};
