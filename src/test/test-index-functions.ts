import test from 'ava';

import { getNextIndex, getPreviousIndex } from '../util/util-functions';

test('getNextIndex', (t) => {
	const fixture = [0, 5, 10, 15, 20];

	t.is(getNextIndex(fixture, 3), 5);
	t.is(getNextIndex(fixture, 10), 15);
	t.is(getNextIndex(fixture, 20), 20);
	t.is(getNextIndex(fixture, 25), 20);
});

test('getPreviousIndex', (t) => {
	const fixture = [0, 5, 10, 15, 20];

	t.is(getPreviousIndex(fixture, 3), 0);
	t.is(getPreviousIndex(fixture, 10), 5);
	t.is(getPreviousIndex(fixture, 20), 15);
	t.is(getPreviousIndex(fixture, 25), 20);
});
