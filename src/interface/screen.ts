import * as clipboardy from 'clipboardy';

import { notificationRequested } from '../redux/action-creators';
import { store } from '../redux/store';
import { Screen } from '../types/types';
import { getScreenElement } from './interface-elements';

export function getScreen(): Screen {
	const screen: Screen = getScreenElement({
		smartCSR: true,
	});

	screen.key('c', copySHAToClipboard);
	screen.key(['C-c', 'q', 'escape'], () => process.exit(0));

	return screen;
}

function copySHAToClipboard(): void {
	const {SHA} = store.getState();

	clipboardy.writeSync(SHA);

	store.dispatch(notificationRequested(`Copied SHA to the clipboard: ${SHA}`));
}
