import { IAction, NotificationType } from '../types/types';

export function addCommits(commits: string[]): IAction {
	return {
		payload: commits,
		type: 'ADD_COMMITS',
	};
}

export function decrementIndex(): IAction {
	return {
		type: 'DECREMENT_INDEX',
	};
}

export function incrementIndex(): IAction {
	return {
		type: 'INCREMENT_INDEX',
	};
}

export function notificationRequested(
	text: string, type: NotificationType): IAction {

	return {
		payload: {
			text,
			type,
		},
		type: 'NOTIFICATION_REQUESTED',
	};
}

export function notificationSent(): IAction {
	return {
		type: 'NOTIFICATION_SENT',
	};
}

export function viewCommit(): IAction {
	return {
		type: 'VIEW_COMMIT',
	};
}

export function viewList(): IAction {
	return {
		type: 'VIEW_LIST',
	};
}
