#!/usr/bin/env node

if (require('child_process').spawnSync('git', ['rev-parse', '--is-inside-work-tree']).status > 0) {
	process.stderr.write('jack must be used inside a git project.\n');

	process.exit(1);
}

const app = require('./dist/app');

if (process.stdin.isTTY) {
	app.run(process.argv.slice(2));
} else {
	app.runFromPipedData();
}
