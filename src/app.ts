import { ChildProcess } from 'child_process';

import { getCommitElement } from './interface/commit-view';
import {
	addColorsToItem,
	constructProgressText,
	getScreenElement,
	getTextElement,
} from './interface/interface-elements';
import { getListElement } from './interface/list-view';
import { addCommits } from './redux/action-creators';
import { store } from './redux/store';
import {
	BlessedElement,
	BoxElement,
	IListElement,
	IState,
	Screen,
	TextElement,
} from './types/types';
import {
	COMMIT_ELEMENT_SEPARATOR,
	getCommitContentSync,
	getGitLogProcess,
} from './util/git-util';

export function run(args: string[]): void {
	store.subscribe(renderScreen(getScreenElement()));

	const process: ChildProcess = getGitLogProcess(args);

	process.stdout.setEncoding('utf8');

	process.stdout.on('data', (data: string) => {
		store.dispatch(
			addCommits(
				data.split('\n').filter((item: string) => Boolean(item))));
	});
}

function renderScreen(screen: Screen): () => Screen {
	let lastState: IState = store.getState();

	const commitContentMap: Map<string, string> = new Map();

	let commit: BoxElement;
	let list: IListElement;
	let progressBar: TextElement;

	return (): Screen => {
		const state: IState = store.getState();

		const {commits, index, view} = state;

		const lastView = lastState.view;

		const isNewView: boolean = view !== lastView;
		const isNewIndex: boolean = index !== lastState.index;
		const isNewCommits: boolean = commits !== lastState.commits;

		/*

		Create elements if they don't exist

		*/

		if (!commit) {
			commit = getCommitElement('', commits, index);

			screen.append(commit);
		}

		if (!list) {
			list = getListElement(commits, index);

			screen.append(list);
		}

		if (!progressBar) {
			progressBar = getTextElement(
				constructProgressText(index, commits.length));

			screen.append(progressBar);
		}

		/*

		UI update conditions

		*/

		if (isNewCommits) {
			list.setItems(commits.map(addColorsToItem));
		}

		if (isNewCommits || isNewIndex) {
			progressBar.setText(constructProgressText(index, commits.length));
		}

		if (view === 'LIST' && isNewView) {
			swapViews(commit, list);

			list.select(index);
		}

		if (view === 'COMMIT') {
			if (isNewView) {
				swapViews(list, commit);
			}

			if (isNewView || isNewIndex) {
				const [sha] = commits[index].split(COMMIT_ELEMENT_SEPARATOR);

				let content: string | undefined = commitContentMap.get(sha);

				if (!content) {
					content = getCommitContentSync(sha);

					commitContentMap.set(sha, content);
				}

				commit.setContent(content);
			}
		}

		screen.render();

		lastState = state;

		return screen;
	};
}

function swapViews(oldViewElement: BlessedElement, newViewElement: BlessedElement) {
	oldViewElement.hide();

	newViewElement.show();
	newViewElement.focus();
}
