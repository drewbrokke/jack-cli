import { BoxElement } from '../types/types';
import { getNotificationTimeout } from '../util/config-util';
import { getBoxElement } from './interface-elements';

let notificationContainer: BoxElement;

export const getNotificationContainer = (): BoxElement => {
	if (notificationContainer) {
		return notificationContainer;
	}

	notificationContainer = getBoxElement({
		border: {
			type: 'line',
		},
		bottom: 1,
		name: 'notificationContainer',
		padding: {
			left: 1,
			right: 1,
		},
		right: 0,
		shrink: true,
		tags: true,
	});

	notificationContainer.hide();

	return notificationContainer;
};

export const notify = (content: string) => appendNotification(content);

export const notifyError = (content: string) =>
	appendNotification(content, 'red');

export const notifyInfo = (content: string) =>
	appendNotification(content, 'blue');

export const notifySuccess = (content: string) =>
	appendNotification(content, 'green');

export const notifyWarning = (content: string) =>
	appendNotification(content, 'yellow');

const appendNotification = (content: string, color: string | null = null) => {
	if (notificationContainer.content.length) {
		const longestLineLength = content
			.split('\n')
			.reduce((acc, cur) => (acc >= cur.length ? acc : cur.length), 0);

		notificationContainer.pushLine('-'.repeat(longestLineLength));
	}

	notificationContainer.pushLine(
		color ? `{${color}-fg}{bold}${content}{/bold}{/${color}-fg}` : content,
	);

	setTimeout(() => {
		notificationContainer.shiftLine(content.split('\n').length + 1);

		if (!notificationContainer.content.length) {
			notificationContainer.hide();
		}

		notificationContainer.screen.render();
	}, getNotificationTimeout());

	notificationContainer.show();
	notificationContainer.screen.render();
};
