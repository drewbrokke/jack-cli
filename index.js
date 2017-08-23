#!/usr/bin/env node

const app = require('./dist/app');

if (process.stdin.isTTY) {
	app.run(process.argv.slice(2));
} else {
	app.runFromPipedData();
}
