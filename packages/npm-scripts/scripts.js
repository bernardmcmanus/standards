const Path = require('path');
const fs = require('fs');

const noop = require('lodash/noop');

const { createExporter } = require('./lib/helpers');
const { ConcurrentSet, SequentialSet, Script } = require('./lib/script');

const exporter = createExporter(exports);

const eslint = exporter('eslint', () => new Script({
	cmd: 'eslint',
	args: [
		'--ext', '.js,.jsx,.ts,.tsx',
		'--cache',
		'--cache-location', 'node_modules/.cache/eslint/',
		'--max-warnings=0',
		'--report-unused-disable-directives'
	]
}))();

const prettier = exporter('prettier', () => new Script({
	cmd: 'bash',
	args: [
		'-c',
		'exec prettier'
	],
	appendExtrasToLastArg: true,
	conditions: [
		{
			cmd: 'which',
			args: ['prettier']
		}
	]
}))();

const stylelint = exporter('stylelint', () => new Script({
	cmd: 'stylelint',
	args: [
		'--ignore-path', '.eslintignore',
		'--cache',
		'--cache-location', 'node_modules/.cache/stylelint/',
		'--max-warnings=0'
	]
}))();

const nodemon = exporter('nodemon', () => new Script({
	cmd: 'nodemon',
	args: [
		'--config',
		() => {
			const configPath = Path.resolve(__dirname, '..', '.nodemon.json');
			const config = require('./lib/nodemon');
			fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
			return configPath;
		}
	],
	conditions: [
		{
			cmd: 'which',
			args: ['nodemon']
		}
	]
}))();

const webpack = exporter('webpack', () => new Script({
	cmd: 'bash',
	args: [
		'-c',
		'exec node -r esm `which webpack`'
	],
	appendExtrasToLastArg: true,
	conditions: [
		{
			cmd: 'which',
			args: ['webpack']
		}
	]
}))();

const tsc = exporter('tsc', () => new Script({
	cmd: 'tsc',
	conditions: [
		{
			cmd: 'bash',
			args: [
				'-c',
				'[ -f tsconfig.json ] || exit 1'
			]
		}
	]
}))();

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
 * Run eslint, stylelint, and prettier
 */
exporter('format', () => new SequentialSet([
	new ConcurrentSet([
		{
			cmd: 'npm-scripts',
			args: [
				'eslint',
				'--label',
				'--',
				'.',
				'--fix'
			],
			conditions: [
				eslint
			],
			onError: noop
		},
		{
			cmd: 'npm-scripts',
			args: [
				'stylelint',
				'--label',
				'--',
				'**/*.{css,less,sass,scss}',
				'--fix'
			],
			conditions: [
				stylelint
			],
			onError: noop,
			type: Script.OPTIONAL
		}
	]),
	{
		cmd: 'npm-scripts',
		args: [
			'prettier',
			'--label',
			'--',
			'--write',
			'.'
		],
		conditions: [
			prettier
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
			'--label',
			'--',
			'.'
		],
		conditions: [
			eslint
		]
	},
	{
		cmd: 'npm-scripts',
		args: [
			'prettier',
			'--label',
			'--',
			'--list-different',
			'.'
		],
		conditions: [
			prettier
		]
	},
	{
		cmd: 'npm-scripts',
		args: [
			'stylelint',
			'--label',
			'--',
			'**/*.{css,less,sass,scss}'
		],
		conditions: [
			stylelint
		],
		type: Script.OPTIONAL
	},
	{
		cmd: 'npm-scripts',
		args: [
			'tsc',
			'--label',
			'--',
			'--noEmit'
		],
		conditions: [
			tsc
		],
		type: Script.OPTIONAL
	},
]));

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
 * start webpack dev server
 */
exporter('webpack:start', () => new Script({
	cmd: 'npm-scripts',
	args: [
		'start',
		() => require.resolve('@bernardmcmanus/webpack-config/server')
	],
	conditions: [
		nodemon,
		webpack
	]
}));

const webpackBuildApp = exporter('webpack:build:app', () => new Script({
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
}))();

const webpackBuildDll = exporter('webpack:build:dll', () => new Script({
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
}))();

exporter('webpack:build', () => new SequentialSet([
	webpackBuildDll,
	webpackBuildApp,
]));

exporter('webpack:postinstall', () => new Script({
	cmd: 'npm-scripts',
	args: [
		'webpack:build:dll'
	],
	conditions: [
		webpack
	],
	env: ({ NODE_ENV }) => ({
		NODE_ENV: NODE_ENV || 'development'
	})
}));
