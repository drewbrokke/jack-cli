import {
	BoxElement,
	Screen,
	TextElement,
	TextOptions,
} from '../types/types';
import { getBoxElement, getTextElement } from './interface-elements';

let notificationContainer: BoxElement;

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

export function notify(content: string): void {
	notificationContainer.append(getNotification(content));
}

// Helper functions

function getNotification(content: string): TextElement {
	const options: TextOptions = {
		align: 'center',
		bg: '#294',
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
