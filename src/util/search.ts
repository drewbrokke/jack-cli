import { store } from '../state/store';
import { SearchIndex } from '../types/types';
import { getSearchIndexLimit, getUseSearchIndex } from './config-util';

const defaultSearchIndex: SearchIndex = {
	clearIndex(): void {
		return;
	},
	indexLine(_id: number, _line: string): void {
		return;
	},
	async search(searchTerm: string): Promise<number[]> {
		const indexesMatchingSearch: number[] = [];

		if (!!searchTerm) {
			const { lines } = store.getState();
			searchTerm = searchTerm.toLowerCase();

			for (let i = 0; i < lines.length; i++) {
				const searchableLine = lines[i].toLowerCase();

				if (searchableLine.includes(searchTerm)) {
					indexesMatchingSearch.push(i);
				}
			}
		}

		return Promise.resolve(indexesMatchingSearch);
	},
};

const flexSearchSearchIndex = (limit: number): SearchIndex => {
	const flexsearch = require('flexsearch');

	const flexSearchIndex = flexsearch.create({ async: true, profile: 'fast' });

	return {
		clearIndex(): void {
			flexSearchIndex.clear();
		},
		indexLine(id: number, line: string): void {
			if (id > limit) {
				return;
			}

			if (!line || line.trim() === '') {
				return;
			}

			flexSearchIndex.add(id, line);
		},
		async search(searchTerm: string): Promise<number[]> {
			const results = await flexSearchIndex.search(searchTerm, {
				limit,
			});

			results.sort((a: number, b: number) => a - b);

			return results;
		},
	};
};

let searchIndexImpl: SearchIndex = defaultSearchIndex;

if (getUseSearchIndex()) {
	searchIndexImpl = flexSearchSearchIndex(getSearchIndexLimit());
}

export const searchIndex: SearchIndex = searchIndexImpl;
