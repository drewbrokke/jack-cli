import test from 'ava';

import { uniqBy, uniqByLast } from '../dist/util/util-functions';

const objects = [
	{ name: 'a', id: 1 },
	{ name: 'b', id: 2 },
	{ name: 'a', id: 3 },
];

const stringify = (objArray) => objArray.map((obj) => obj.id).join('');

test('uniqBy', (t) => {
	t.plan(1);
	t.is(stringify(uniqBy(objects, 'name')), '12');
});

test('uniqByLast', async (t) => {
	t.plan(1);
	t.is(stringify(uniqByLast(objects, 'name')), '23');
});
