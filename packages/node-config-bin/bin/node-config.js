#!/usr/bin/env node

const cp = require('child_process');
const Path = require('path');

const exePath = Path.resolve(__dirname, '../dist/node-config');

cp.spawn(exePath, process.argv.slice(2), { stdio: 'inherit' });
