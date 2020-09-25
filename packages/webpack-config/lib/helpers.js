const Path = require('path');

const glob = require('glob')
const once = require('lodash/once');

const pkg = require('../package.json');

exports.env = process.env.NODE_ENV || 'development';

exports.getManifests = once(() =>
	glob.sync('dist/static/dll/.manifest.*.json').map(rel => Path.resolve(rel))
);

exports.development = (value = true) =>
	exports.env !== 'production' && value;

exports.production = (value = true) =>
	exports.env === 'production' && value;

exports.tryCatch = (fn, fallback) => {
	try {
		return fn();
	} catch (err) {
		console.warn(`[${pkg.name}] \x1b[33mwarn:\x1b[0m ${err.message}`);
		return fallback;
	}
};
