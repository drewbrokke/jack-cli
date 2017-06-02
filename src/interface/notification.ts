import {
	BoxElement,
	Screen,
	TextElement,
	TextOptions,
} from '../types/types';
import { getBoxElement, getTextElement } from './interface-elements';

let notificationContainer: BoxElement;

const COLOR_ERROR: string = 'red';
const COLOR_SUCCESS: string = '#294';

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

export function notifyError(content: string): void {
	notificationContainer.append(getNotification(content, COLOR_ERROR));
}

export function notifySuccess(content: string): void {
	notificationContainer.append(getNotification(content, COLOR_SUCCESS));
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
	}, 3000);

	notification.on('mouseup', () => {
		clearTimeout(notificationDestroyTimer);

		notification.destroy();
		screen.render();
	});

	return notification;
}
