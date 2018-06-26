import test from 'ava';

import { stringToCommandArray } from '../dist/util/util-functions';

test('stringToCommandArray', t => {
	t.plan(2);
	t.deepEqual(
		stringToCommandArray('hello world'),
		['hello', 'world']);

	t.deepEqual(
		stringToCommandArray('git -p diff [%SHA_RANGE%] --name-only | sed s,/src/.*,, | sed s,/build.gradle,, | uniq -c | sort -r | less'),
		[
			"git",
			"-p",
			"diff",
			"[%SHA_RANGE%]",
			"--name-only",
			"|",
			"sed",
			"s,/src/.*,,",
			"|",
			"sed",
			"s,/build.gradle,,",
			"|",
			"uniq",
			"-c",
			"|",
			"sort",
			"-r",
			"|",
			"less"
		]
	);
});