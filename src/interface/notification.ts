import { generateTags } from 'blessed';

import {
	BoxElement,
	TextElement,
	TextOptions,
} from '../types/types';
import { helpText } from '../util/help-text';
import { getBoxElement, getTextElement } from './interface-elements';

let notificationContainer: BoxElement;
let helpBox: TextElement;

export function getNotificationContainer(): BoxElement {
	if (notificationContainer) {
		return notificationContainer;
	}

	notificationContainer = getBoxElement({
		border: {
			type: 'line',
		},
		bottom: 1,
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
}

export function notify(content: string) {
	appendNotification(content);
}

export function notifyError(content: string) {
	appendNotification(content, 'red');
}

export function notifyInfo(content: string) {
	appendNotification(content, 'blue');
}

export function notifySuccess(content: string) {
	appendNotification(content, 'green');
}

export function notifyWarning(content: string) {
	appendNotification(content, 'yellow');
}

function appendNotification(content: string, color: string | null = null) {
	if (notificationContainer.content.length) {
		const longestLineLength = content.split('\n')
			.reduce((acc, cur) => (acc >= cur.length) ? acc : cur.length, 0);

		notificationContainer.pushLine('-'.repeat(longestLineLength));
	}

	notificationContainer.pushLine(
		color ? generateTags({bold: true, fg: color}, content) : content);

	setTimeout(() => {
		notificationContainer.shiftLine(content.split('\n').length + 1);

		if (!notificationContainer.content.length) {
			notificationContainer.hide();
		}

		notificationContainer.screen.render();
	}, 5000);

	notificationContainer.show();
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

function getPersistentNotification(content: string, bg: string): TextElement {
	const options: TextOptions = {
		align: 'center',
		bg,
		border: 'line',
		content,
		shrink: true,
		valign: 'middle',
	};

	const notification: TextElement = getTextElement(options);

	notification.focus();

	return notification;
}
