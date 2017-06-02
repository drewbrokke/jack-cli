import {
	BoxElement,
	NotificationType,
	Screen,
	TextElement,
	TextOptions,
} from '../types/types';
import { helpText } from '../util/help-text';
import { getBoxElement, getTextElement } from './interface-elements';

let notificationContainer: BoxElement;
let helpBox: TextElement;

const colors: Map<NotificationType, string> = new Map();

colors.set('ERROR', 'red');
colors.set('INFO', 'blue');
colors.set('SUCCESS', '#294');
colors.set('WARNING', 'yellow');

export function getNotificationContainer(): BoxElement {
	if (!notificationContainer) {
		notificationContainer = getBoxElement({
			bottom: 0,
			right: 0,
			shrink: true,
		});
	}

	return notificationContainer;
}

export function notify(content: string, type: NotificationType) {
	notificationContainer.append(
		getNotification(content, colors.get(type) || 'blue'));
}

export function toggleHelp() {
	if (!helpBox) {
		helpBox = getPersistentNotification(helpText, 'none');

		notificationContainer.append(helpBox);
	} else {
		helpBox.toggle();
	}

	notificationContainer.screen.render();
}

// Helper functions

function getNotification(content: string, bg: string): TextElement {
	const options: TextOptions = {
		align: 'center',
		bg,
		clickable: true,
		content,
		padding: {
			bottom: 1,
			left: 2,
			right: 2,
			top: 1,
		},
		shrink: true,
		valign: 'middle',
	};

	const notification: TextElement = getTextElement(options);
	const screen: Screen = notification.screen;

	const notificationDestroyTimer: NodeJS.Timer = setTimeout(() => {
		notification.destroy();
		screen.render();
	}, 5000);

	notification.on('mouseup', () => {
		clearTimeout(notificationDestroyTimer);

		notification.destroy();
		screen.render();
	});

	return notification;
}

function getPersistentNotification(content: string, bg: string): TextElement {
	const options: TextOptions = {
		align: 'center',
		bg,
		border: 'line',
		clickable: true,
		content,
		padding: {
			bottom: 1,
			left: 2,
			right: 2,
			top: 1,
		},
		shrink: true,
		valign: 'middle',
	};

	const notification: TextElement = getTextElement(options);
	const screen: Screen = notification.screen;

	notification.on('mouseup', () => {
		notification.destroy();
		screen.render();
	});

	notification.focus();

	return notification;
}
