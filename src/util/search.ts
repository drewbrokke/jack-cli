import { SearchIndex } from '../types/types';
import { store } from '../state/store';

const USE_SEARCH_INDEXER = true;

const defaultSearchIndex: SearchIndex = {
	clearIndex: function(): void {},
	indexLine: function(_id: number, _line: string): void {},
	search: async function(searchTerm: string): Promise<number[]> {
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

const FlexSearch = require('flexsearch');
const LIMIT = 100000;

const flexSearchSearchIndex = (limit: number): SearchIndex => {
	const searchIndex = FlexSearch.create({ async: true, profile: 'fast' });

	return {
		clearIndex: function(): void {
			searchIndex.clear();
		},
		indexLine: function(id: number, line: string): void {
			if (id > limit) {
				return;
			}

			if (!line || line.trim() == '') {
				return;
			}

			searchIndex.add(id, line);
		},
		search: async function(searchTerm: string): Promise<number[]> {
			const results = await searchIndex.search(searchTerm, {
				limit,
			});

			results.sort((a: number, b: number) => a - b);

			return results;
		},
	};
};

export const searchIndex: SearchIndex = USE_SEARCH_INDEXER
	? flexSearchSearchIndex(LIMIT)
	: defaultSearchIndex;
