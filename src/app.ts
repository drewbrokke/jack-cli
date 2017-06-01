import { ChildProcess } from 'child_process';

import { getCommitElement } from './interface/commit-view';
import {
	constructProgressText,
	getScreenElement,
	getTextElement,
} from './interface/interface-elements';
import { getListElement } from './interface/list-view';
import { addCommits } from './redux/action-creators';
import { store } from './redux/store';
import {
	BlessedElement,
	IListElement,
	IState,
	Screen,
	ScrollableTextElement,
	TextElement,
} from './types/types';
import {
	getCommitContentSync,
	getGitLogProcess,
} from './util/git-util';

export function run(args: string[]): void {
	store.subscribe(renderScreen(getScreenElement()));

	let dataString = '';
	const gitLogProcess: ChildProcess = getGitLogProcess(args);

	gitLogProcess.stdout.setEncoding('utf8');
	gitLogProcess.stdout.on('data', (data: string) => dataString += data);
	gitLogProcess.on('close', () => store.dispatch(addCommits(dataString.split('\n'))));
}

function renderScreen(screen: Screen): () => Screen {
	let lastState: IState = store.getState();

	const commitContentMap: Map<string, string> = new Map();

	let commit: ScrollableTextElement;
	let list: IListElement;
	let progressBar: TextElement;

	return (): Screen => {
		const state: IState = store.getState();

		const {commits, index, SHA, view} = state;

		const lastView = lastState.view;

		const isNewView: boolean = view !== lastView;
		const isNewIndex: boolean = index !== lastState.index;
		const isNewCommits: boolean = commits !== lastState.commits;

		/*

		Create elements if they don't exist

		*/

		if (!commit) {
			commit = getCommitElement();

			screen.append(commit);
		}

		if (!list) {
			list = getListElement();

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
			list.setItems(commits);
		}

		if (isNewCommits || isNewIndex) {
			progressBar.setText(constructProgressText(index, commits.length));

			list.select(index);
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
				let content: string | undefined = commitContentMap.get(SHA);

				if (!content) {
					content = getCommitContentSync(SHA);

					commitContentMap.set(SHA, content);
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
