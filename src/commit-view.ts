import { Action, doAction } from './action-handler';
import { getCommitContent } from './git-util';
import { constructProgressText, getBoxElement, getTextElement } from './interface-elements';
import { BoxElement, KeyEvent, Screen, TextElement } from './types';

const contentCache: Map<string, string> = new Map<string, string>();

export function renderCommitView(screen: Screen): void {
	const {commits, content, index} = screen.data;

	const {length} = commits;

	let contentBox: BoxElement;
	let progressMarker: TextElement;

	const handleDownOrUpKeys = (newIndex: number) =>
		updateContent(newIndex, commits, screen);

	const handleKeypressFn = (_ch: string, key: KeyEvent) => {
		switch (key.name) {
			case 'down':
			case 'j':
				handleDownOrUpKeys(index + 1);

				break;

			case 'k':
			case 'up':
				handleDownOrUpKeys(index - 1);

				break;

			case 'enter':
			case 'space':
				doAction(Action.RENDER_LIST, {commits, content, index, screen});

				break;

			default: break;
		}
	};

	contentBox = getBoxElement({content}, handleKeypressFn);

	progressMarker = getTextElement(constructProgressText(index, length));

	contentBox.append(progressMarker);
	contentBox.focus();

	screen.append(contentBox);
	screen.render();
}

async function updateContent(
	index: number, commits: string[], screen: Screen): Promise<void> {

	let content: string | undefined;
	let sha: string;

	if (index < 0) return;
	if (index >= commits.length) return;

	sha = commits[index].slice(0, 12);

	content = contentCache.get(sha);

	if (!content) {
		content = await getCommitContent(sha);

		contentCache.set(sha, content);
	}

	doAction(Action.RENDER_COMMIT, {commits, content, index, screen});
}
