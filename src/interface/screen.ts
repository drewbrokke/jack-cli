import { IScreen } from '../types/types';
import {
	doCherryPick,
	doCopyCommitMessage,
	doCopyCommitSHA,
	doDiff,
	doDiffNameOnly,
	doDifftool,
	doMarkCommit,
	doOpenDiffInEditor,
	doOpenFilesInEditor,
	doStartInteractiveRebase,
} from '../util/interface-actions';
import { getHelpDialog, toggleHelp } from './help-dialog';
import { getScreenElement } from './interface-elements';
import { getMainContentContainer } from './main-content-container';
import { getNotificationContainer } from './notification';
import { getStatusBar } from './status-bar';

export const getScreen = (): IScreen => {
	const screen: IScreen = getScreenElement({
		autoPadding: true,
		smartCSR: true,
	});

	screen._listenedMouse = true;

	screen.key('?', toggleHelp);
	screen.key('S-c', doCherryPick);
	screen.key('d', () => doDiff(screen));
	screen.key('e', doOpenDiffInEditor);
	screen.key('S-i', () => doStartInteractiveRebase(screen));
	screen.key('m', doCopyCommitMessage);
	screen.key('n', () => doDiffNameOnly(screen));
	screen.key('o', doOpenFilesInEditor);
	screen.key('t', doDifftool);
	screen.key('x', doMarkCommit);
	screen.key('y', doCopyCommitSHA);
	screen.key(['C-c', 'q', 'escape'], () => process.exit(0));

	screen.append(getMainContentContainer());
	screen.append(getStatusBar());
	screen.append(getNotificationContainer());
	screen.append(getHelpDialog());

	return screen;
};
