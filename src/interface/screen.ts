import { Actions } from '../state/actions';
import { BlessedElement, BoxElement, Screen, View } from '../types/types';
import { registerCommand } from '../util/command-util';
import { Command } from '../util/commands-def';
import { getUseLegacyEscapeKeyBehavior } from '../util/config-util';
import {
	doCopyCommitMessage,
	doCopyCommitSHA,
	doMarkCommit,
	doOpenFilesInEditor,
} from '../util/interface-actions';
import { generateLog } from '../util/log-util';
import { getHelpDialog, toggleHelp } from './help-dialog';
import { getBoxElement, getScreenElement } from './interface-elements';
import { getMainContentContainer } from './main-content-container';
import { getNotificationContainer } from './notification';
import { getStatusBar } from './status-bar';

const quit = () => process.exit(0);

export const getScreen = (commands: Command[]): Screen => {
	const screen: Screen = getScreenElement({
		autoPadding: true,
		fullUnicode: true,
		name: 'screen',
		smartCSR: true,
	});

	screen.key(['C-c', 'q'], quit);

	let escapeKeyFunction = () => Actions.updateView(View.LIST);

	if (getUseLegacyEscapeKeyBehavior()) {
		escapeKeyFunction = quit;
	}

	screen.key('escape', escapeKeyFunction);

	screen._listenedMouse = true;

	const wrapper: BoxElement = getBoxElement({
		bottom: 0,
		left: 0,
		name: 'wrapper',
		right: 0,
		top: 0,
	});

	screen.append(wrapper);

	wrapper.append(getMainContentContainer());
	wrapper.append(getStatusBar());
	wrapper.append(getNotificationContainer());
	wrapper.append(getHelpDialog());

	screen.key('?', toggleHelp);
	screen.key('m', doCopyCommitMessage);
	screen.key('o', doOpenFilesInEditor);
	screen.key('r', () => generateLog(screen));
	screen.key('x', doMarkCommit);
	screen.key('y', doCopyCommitSHA);

	const wrapperHider = getHider(wrapper);

	for (const command of commands) {
		screen.key(command.key, async () => {
			if (command.foreground) {
				wrapperHider.hide();
			}

			await registerCommand(screen, command);

			if (command.foreground) {
				wrapperHider.show();
			}
		});
	}

	return screen;
};

interface Hider {
	hide(): void;
	show(): void;
}

const getHider = (element: BlessedElement): Hider => ({
	hide() {
		element.hide();
		element.screen.render();
	},
	show() {
		element.show();
		element.screen.render();
	},
});
