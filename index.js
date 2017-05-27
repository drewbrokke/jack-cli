#!/usr/bin/env node

const app = require('./dist/app');

app.run(process.argv.slice(2));