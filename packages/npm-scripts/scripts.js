const noop = require('lodash/noop');

const { createExporter } = require('./lib/helpers');
const { ConcurrentSet, SequentialSet, Script } = require('./lib/script');

const exporter = createExporter(exports);

/**
 * @babel/cli
 */
exporter('babel', () => new Script({
	cmd: 'babel',
	args: [
		'--extensions', '.js,.jsx,.ts,.tsx',
		'--copy-files',
		'--out-dir', 'dist',
		'--source-maps', 'inline',
		'--ignore', '**/*.d.ts'
	],
	env: ({ NODE_ENV }) => ({
		NODE_ENV: NODE_ENV || 'production'
	})
}));

/**
 * Clean output
 */
exporter('clean', () => new ConcurrentSet([
	{
		cmd: 'rimraf',
		args: ['coverage', 'dist']
	}
]));

/**
 * Clean cache
 */
exporter('clean:cache', () => new Script({
	cmd: 'rimraf',
	args: ['node_modules/.cache']
}));

/**
 * Clean all
 */
exporter('clean:all', () => new ConcurrentSet([
	{
		cmd: 'npm-scripts',
		args: ['clean']
	},
	{
		cmd: 'npm-scripts',
		args: ['clean-cache']
	}
]));

/**
 * eslint
 */
exporter('eslint', () => new Script({
	cmd: 'eslint',
	args: [
		'--ext', '.js,.jsx,.ts,.tsx',
		'--cache',
		'--cache-location', 'node_modules/.cache/eslint/',
		'--max-warnings=0',
		'--report-unused-disable-directives'
	]
}));

/**
 * Run eslint, stylelint, and prettier
 */
exporter('format', () => new SequentialSet([
	new ConcurrentSet([
		{
			cmd: 'npm-scripts',
			args: [
				'eslint',
				'.',
				'--',
				'--fix'
			],
			onError: noop
		},
		{
			cmd: 'npm-scripts',
			args: [
				'stylelint',
				'**/*.{css,less,sass,scss}',
				'--',
				'--fix'
			],
			conditions: [
				{
					cmd: 'which',
					args: ['stylelint']
				}
			],
			onError: noop,
			type: Script.OPTIONAL
		}
	]),
	{
		cmd: 'npm-scripts',
		args: [
			'prettier',
			'--',
			'--write',
			'.'
		],
		onError: noop
	}
]));

/**
 * Run tsc, eslint, prettier, and stylelint
 */
exporter('lint', () => new ConcurrentSet([
	{
		cmd: 'npm-scripts',
		args: [
			'eslint',
			'.'
		]
	},
	{
		cmd: 'npm-scripts',
		args: [
			'prettier',
			'--',
			'--list-different',
			'.'
		],
	},
	{
		cmd: 'npm-scripts',
		args: [
			'stylelint',
			'**/*.{css,less,sass,scss}'
		],
		conditions: [
			{
				cmd: 'which',
				args: ['stylelint']
			}
		],
		type: Script.OPTIONAL
	},
	{
		cmd: 'tsc',
		args: ['--noEmit'],
		type: Script.OPTIONAL
	},
]));

/**
 * nodemon
 */
const nodemon = exporter('nodemon', () => new Script({
	cmd: 'bash',
	args: [
		'-c',
		`nodemon --config <(node -e 'console.log(JSON.stringify(require("${require.resolve('./lib/nodemon')}"), null, 2))')`
	],
	conditions: [
		{
			cmd: 'which',
			args: ['nodemon']
		}
	]
}))();

/**
 * prettier
 */
exporter('prettier', () => new Script({
	cmd: 'prettier'
}));

/**
 * start development server
 */
exporter('start', () => new Script({
	cmd: 'npm-scripts',
	args: [
		'nodemon'
	],
	conditions: [
		nodemon
	],
	env: ({ NODE_ENV }) => ({
		NODE_ENV: NODE_ENV || 'development'
	})
}));

/**
 * stylelint
 */
exporter('stylelint', () => new Script({
	cmd: 'stylelint',
	args: [
		'--ignore-path', '.eslintignore',
		'--cache',
		'--cache-location', 'node_modules/.cache/stylelint/',
		'--max-warnings=0'
	]
}));

/**
 * webpack
 */
const webpack = exporter('webpack', () => new Script({
	cmd: 'node',
	args: [
		'-r',
		'esm',
		'`which webpack`'
	],
	conditions: [
		{
			cmd: 'which',
			args: ['webpack']
		}
	]
}))();

/**
 * start webpack dev server
 */
exporter('webpack:start', () => new Script({
	cmd: 'npm-scripts',
	args: [
		'start',
		() => require.resolve('@bernardmcmanus/webpack-config/server')
	],
	conditions: [
		webpack
	]
}));

/**
 * webpack build app
 */
exporter('webpack:build:app', () => new Script({
	cmd: 'npm-scripts',
	args: [
		'webpack',
		'--',
		'--config',
		() => require.resolve('@bernardmcmanus/webpack-config/app')
	],
	conditions: [
		webpack
	],
	env: ({ NODE_ENV }) => ({
		NODE_ENV: NODE_ENV || 'production'
	})
}));

/**
 * webpack build dll
 */
exporter('webpack:build:dll', () => new Script({
	cmd: 'npm-scripts',
	args: [
		'webpack',
		'--',
		'--config',
		() => require.resolve('@bernardmcmanus/webpack-config/dll')
	],
	conditions: [
		webpack
	],
	env: ({ NODE_ENV }) => ({
		NODE_ENV: NODE_ENV || 'production'
	})
}));

/**
 * webpack postinstall
 */
exporter('webpack:postinstall', () => new Script({
	cmd: 'npm-scripts',
	args: [
		'webpack:build:dll'
	],
	conditions: [
		webpack
	],
	type: Script.OPTIONAL,
	env: ({ NODE_ENV }) => ({
		NODE_ENV: NODE_ENV || 'development'
	})
}));
