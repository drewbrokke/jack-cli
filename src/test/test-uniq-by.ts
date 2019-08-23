import test from 'ava';

import { uniqBy, uniqByLast } from '../util/util-functions';

interface TestObject {
	name: string;
	id: number;
}

const objects: TestObject[] = [
	{ name: 'a', id: 1 },
	{ name: 'b', id: 2 },
	{ name: 'a', id: 3 },
];

test('uniqBy will ignore later matching properties', (t) => {
	const actual: TestObject[] = uniqBy(objects, 'name');
	const expected: TestObject[] = [{ name: 'a', id: 1 }, { name: 'b', id: 2 }];

	t.plan(1);
	t.deepEqual(actual, expected);
});

test('uniqByLast will keep later matching properties', async (t) => {
	const actual: TestObject[] = uniqByLast(objects, 'name');
	const expected: TestObject[] = [{ name: 'b', id: 2 }, { name: 'a', id: 3 }];

	t.plan(1);
	t.deepEqual(actual, expected);
});
