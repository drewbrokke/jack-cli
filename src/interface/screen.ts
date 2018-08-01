import { IScreen } from '../types/types';
import { getCommands, registerCommand } from '../util/command-util';
import {
	doCopyCommitMessage,
	doCopyCommitSHA,
	doMarkCommit,
	doOpenFilesInEditor,
} from '../util/interface-actions';
import { generateLog } from '../util/log-util';
import { getHelpDialog, toggleHelp } from './help-dialog';
import { getScreenElement } from './interface-elements';
import { getMainContentContainer } from './main-content-container';
import { getNotificationContainer } from './notification';
import { getStatusBar } from './status-bar';

export const getScreen = (): IScreen => {
	const screen: IScreen = getScreenElement({
		autoPadding: true,
		fullUnicode: true,
		smartCSR: true,
	});

	screen._listenedMouse = true;

	screen.append(getMainContentContainer());
	screen.append(getStatusBar());
	screen.append(getNotificationContainer());
	screen.append(getHelpDialog());

	screen.key('?', toggleHelp);
	screen.key('m', doCopyCommitMessage);
	screen.key('o', doOpenFilesInEditor);
	screen.key('r', () => generateLog(screen));
	screen.key('x', doMarkCommit);
	screen.key('y', doCopyCommitSHA);
	screen.key(['C-c', 'q', 'escape'], () => process.exit(0));

	for (const command of getCommands()) {
		screen.key(
			command.key,
			async () => registerCommand(screen, command));
	}

	return screen;
};
