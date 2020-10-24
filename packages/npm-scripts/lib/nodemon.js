const mergeWith = require('lodash/mergeWith');

let mainConfig = {};

try {
	const mainConfigPath = require.resolve('./nodemon', {
		paths: [
			process.cwd()
		]
	});
	mainConfig = require(mainConfigPath);
} catch (err) {
	if (err.code !== 'MODULE_NOT_FOUND') {
		throw err;
	}
}

const defaultConfig = {
	ext: 'g?(raph)ql js?(on) ts y?(a)ml',
	watch: '**/*',
	ignore: ['coverage/', 'dist/', 'node_modules/'],
	env: {
		TS_NODE_TRANSPILE_ONLY: 1
	},
	execMap: {
		js: 'node -r esm',
		jsx: 'node -r @babel/register',
		ts: 'node -r ts-node/register',
		tsx: 'node -r ts-node/register'
	}
};

module.exports = mergeWith(
	{},
	defaultConfig,
	typeof mainConfig === 'function' ? mainConfig({ ...defaultConfig }) : mainConfig,
	(objValue, srcValue) => {
		if (Array.isArray(objValue)) {
			return Array.from(new Set(objValue.concat(srcValue)));
		}
	}
);
