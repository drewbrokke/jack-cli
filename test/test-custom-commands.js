import test from 'ava';

import {
	validate
} from '../dist/util/validators';

test('uniqBy', t => {
	const fixture = {};

	fixture.command = 'hello';
	fixture.description = 'world';
	fixture.key = 'j';

	const errors = validate(fixture);

	(errors);

	t.is(errors.length, 0);
});