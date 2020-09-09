let coreJSVersion;

try {
	({ version: coreJSVersion } = require('core-js/package.json'));
} catch (err) {
	console.warn(
		'WARN: core-js is not installed! Polyfills will not be injected.\n',
	);
	console.warn(err);
}

module.exports = (_, opts = {}) => ({
	presets: [
		[
			'@babel/preset-env',
			{
				corejs: coreJSVersion,
				targets: opts.browser
					? undefined
					: {
							node: 'current',
					  },
				useBuiltIns: 'usage',
				...opts.env,
			},
		],
	],
	plugins: [
		'@babel/plugin-proposal-export-default-from',
		[
			'@babel/plugin-proposal-decorators',
			{
				legacy: true,
			},
		],
		[
			'@babel/plugin-proposal-class-properties',
			{
				loose: true,
			},
		],
		'@babel/plugin-proposal-nullish-coalescing-operator',
		'@babel/plugin-proposal-optional-chaining',
	],
});
