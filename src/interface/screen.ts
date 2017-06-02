import { Screen } from '../types/types';
import { getScreenElement } from './interface-elements';

export function getScreen(): Screen {
	const screen: Screen = getScreenElement({
		smartCSR: true,
	});

	screen.key(['C-c', 'q', 'escape'], () => process.exit(0));

	return screen;
}
