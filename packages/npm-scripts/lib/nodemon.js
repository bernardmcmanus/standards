const mergeWith = require('lodash/mergeWith');

let mainConfig;

try {
	mainConfig = require.resolve('./nodemon.json', {
		paths: [
			process.cwd()
		]
	});
} catch (err) {
	if (err.code !== 'MODULE_NOT_FOUND') {
		throw err;
	}
}

module.exports = mergeWith(
	{
		ext: 'g?(raph)ql js?(on|x) ts?(x) y?(a)ml',
		watch: '**/*',
		ignore: ['coverage/', 'dist/', 'node_modules/'],
		env: {
			TS_NODE_TRANSPILE_ONLY: 1
		},
		execMap: {
			js: 'node --require @babel/register',
			jsx: 'node --require @babel/register',
			ts: 'node --require ts-node/register',
			tsx: 'node --require ts-node/register'
		}
	},
	mainConfig ? require(mainConfig) : {},
	(objValue, srcValue) => {
		if (Array.isArray(objValue)) {
			return Array.from(new Set(objValue.concat(srcValue)));
		}
	}
);
