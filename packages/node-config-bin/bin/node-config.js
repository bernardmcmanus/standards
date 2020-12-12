#!/usr/bin/env node

const cp = require('child_process');
const os = require('os');
const Path = require('path');

const suffix = `${os.platform()}-${os.arch()}`;
const exePath = Path.resolve(__dirname, `../dist/node-config-${suffix}`);

cp.spawn(exePath, process.argv.slice(2), { stdio: 'inherit' });
