import {
	Screen,
	TextElement,
	TextOptions,
} from '../types/types';
import { getTextElement } from './interface-elements';

export function getNotification(content: string): TextElement {
	const options: TextOptions = {
		align: 'center',
		bg: '#294',
		bottom: 0,
		clickable: true,
		content,
		padding: {
			bottom: 1,
			left: 2,
			right: 2,
			top: 1,
		},
		right: 0,
		shrink: true,
		valign: 'middle',
	};

	const notification: TextElement = getTextElement(options);

	const notificationDestroyTimer: NodeJS.Timer = setTimeout(() => {
		const screen: Screen = notification.screen;

		notification.destroy();
		screen.render();
	}, 3000);

	notification.on('mouseup', () => {
		const screen: Screen = notification.screen;

		clearTimeout(notificationDestroyTimer);

		notification.destroy();
		screen.render();
	});

	return notification;
}
