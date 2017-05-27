import { renderCommitView } from './commit-view';
import { getScreenElement } from './interface-elements';
import { renderListView } from './list-view';
import { Node, Screen } from './types';

export const enum Action {
	RENDER_COMMIT,
	RENDER_LIST,
}

export interface IModel {
	commits: string[];
	content?: string;
	index?: number;
	screen?: Screen;
}

export function doAction(action: Action, model: IModel): Screen {
	const screen: Screen = model.screen || getScreenElement();

	screen.data.commits = model.commits;
	screen.data.content = model.content || '';
	screen.data.index = model.index || 0;

	switch (action) {
		case Action.RENDER_COMMIT:
			screen.children.forEach((item: Node) => item.destroy());
			renderCommitView(screen);
			break;

		case Action.RENDER_LIST:
			screen.children.forEach((item: Node) => item.destroy());
			renderListView(screen);
			break;

		default: process.exit(1);
	}

	return screen;
}
