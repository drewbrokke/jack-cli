import {
	BoxElement,
	Screen,
	TextElement,
	TextOptions,
} from '../types/types';
import { helpText } from '../util/help-text';
import { getBoxElement, getTextElement } from './interface-elements';

let notificationContainer: BoxElement;
let helpBox: TextElement;

const COLOR_ERROR = 'red';
const COLOR_INFO = 'blue';
const COLOR_SUCCESS = 'green';
const COLOR_WARNING = 'yellow';

export function getNotificationContainer(): BoxElement {
	if (notificationContainer) {
		return notificationContainer;
	}

	notificationContainer = getBoxElement({
		bottom: 0,
		right: 0,
		shrink: true,
	});

	return notificationContainer;
}

export function notifyError(content: string) {
	appendNotification(getNotification(content, COLOR_ERROR));
}

export function notifyInfo(content: string) {
	appendNotification(getNotification(content, COLOR_INFO));
}

export function notifySuccess(content: string) {
	appendNotification(getNotification(content, COLOR_SUCCESS));
}

export function notifyWarning(content: string) {
	appendNotification(getNotification(content, COLOR_WARNING));
}

function appendNotification(notification: TextElement) {
	notificationContainer.append(notification);

	notificationContainer.screen.render();
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
