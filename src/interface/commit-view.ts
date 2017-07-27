import { spawn } from 'child_process';

import { decrementIndex, incrementIndex, viewList } from '../redux/action-creators';
import { store } from '../redux/store';
import { ScrollableTextElement } from '../types/types';
import { promisifyChildProcess } from '../util/promisify-child-process';
import { getScrollableTextElement } from './interface-elements';

export function getCommitElement(): ScrollableTextElement {
	const commitElement: ScrollableTextElement = getScrollableTextElement({
		bottom: 1,
		clickable: true,
		keys: true,
		left: 0,
		mouse: true,
		right: 0,
		scrollable: true,
		scrollbar: true,
		top: 0,
		vi: true,
	});

	commitElement.key(['right', 'S-down', 'S-j'], () => store.dispatch(incrementIndex()));
	commitElement.key(['left', 'S-k', 'S-up'], () => store.dispatch(decrementIndex()));
	commitElement.key(['enter', 'space'], () => store.dispatch(viewList()));

	commitElement.focus();

	store.subscribe(updateCommitElement(commitElement));

	return commitElement;
}

function updateCommitElement(commitElement) {
	let lastState = store.getState();

	const commitContentMap: Map<string, string> = new Map();

	return () => {
		const state = store.getState();

		if (state.SHA === lastState.SHA && commitElement.content) return lastState = state;

		lastState = state;

		const {SHA} = state;

		if (commitContentMap.get(SHA)) {
			commitElement.setContent(commitContentMap.get(SHA));

			commitElement.scrollTo(0);

			return commitElement.screen.render();
		}

		return promisifyChildProcess(
				spawn(
					'git',
					[
						'show',
						'--patch-with-stat',
						'--stat-width',
						'1000',
						'--color',
						SHA,
					],
				),
			)
			.then((commitContentResult: string) => {
				commitContentMap.set(SHA, commitContentResult);

				commitElement.setContent(commitContentResult);

				commitElement.scrollTo(0);

				return commitElement.screen.render();
			});
	};
}
