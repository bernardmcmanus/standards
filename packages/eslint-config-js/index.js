const {
	rules: airbnbBaseStyleRules,
} = require('eslint-config-airbnb-base/rules/style');
const {
	rules: airbnbBaseVariableRules,
} = require('eslint-config-airbnb-base/rules/variables');

const IMPORT_EXTENSIONS = ['.js'];

module.exports = {
	parser: '@babel/eslint-parser',
	parserOptions: {
		requireConfigFile: true
	},
	plugins: ['babel', 'simple-import-sort', 'sort-keys-fix'],
	extends: [
		'airbnb-base',
		'airbnb-base/rules/strict',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:@bernardmcmanus/eslint-plugin/default',
		'prettier'
	],
	ignorePatterns: [
		'**/__generated__/**',
		'**/coverage/**',
		'**/dist/**',
		'**/generated/**'
	],
	rules: {
		'@bernardmcmanus/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: [
					'**/*.config.*',
					'**/*.spec.*',
					'**/*.stories.*',
					'**/{.storybook,dev,mocks,scripts,spec,stories,test,webpack}/**',
				],
			},
		],
		'simple-import-sort/exports': 'off',
		'simple-import-sort/imports': [
			'error',
			{
				groups: [
					// Side-effects
					['^\\u0000'],
					// Builtins
					[`^(${require('module').builtinModules.join('|')})(/.*|$)`],
					// Scoped NPM Packages
					['^@?\\w'],
					// NPM Packages
					['^[^.]'],
					// Local Paths
					['^\\.'],
				],
			},
		],
		'arrow-body-style': [
			'error',
			'as-needed',
			{ requireReturnForObjectLiteral: false },
		],
		'babel/no-invalid-this': 'error',
		camelcase: ['error', {
			properties: 'always',
			ignoreDestructuring: false,
			ignoreImports: false,
			ignoreGlobals: false,
		}],
		'class-methods-use-this': 'off',
		curly: ['error', 'all'],
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				js: 'never',
				jsx: 'never',
				ts: 'never',
				tsx: 'never',
			},
		],
		'import/no-relative-packages': 'off',
		/**
		 * Ignore imports with a resource query (i.e. icon.svg?inline)
		 */
		'import/no-unresolved': [
			'error',
			{
				caseSensitive: true,
				commonjs: true,
				ignore: [/\.\w+\?/.source],
			},
		],
		'import/order': 'off',
		'import/prefer-default-export': 'off',
		/**
		 * FIXME: Maybe one day prettier will support this
		 * @see https://github.com/prettier/prettier/issues/1622
		 */
		// 'key-spacing': [
		// 	'error',
		// 	{ align: 'value', beforeColon: false, afterColon: true, mode: 'minimum' }
		// ],
		'lines-between-class-members': [
			'error',
			'always',
			{
				exceptAfterSingleLine: true,
			},
		],
		'max-classes-per-file': 'off',
		'new-cap': ['error', { newIsCap: true, capIsNew: false, properties: true }],
		'no-await-in-loop': 'off',
		'no-console': ['error', { allow: ['warn', 'error'] }],
		'no-continue': 'off',
		'no-fallthrough': [
			'error',
			{
				commentPattern: /falls?\s?through|break[\s\w]+omitted/.source,
			},
		],
		'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
		'no-restricted-exports': ['error', {
			"restrictedNamedExports": [
				"then"
			]
		}],
		'no-restricted-syntax': airbnbBaseStyleRules['no-restricted-syntax'].filter(
			(value) =>
				typeof value !== 'object' || value.selector !== 'ForOfStatement',
		),
		'no-underscore-dangle': [
			'error',
			{
				allow: [
					'_id',
					'__APP_CONFIG__',
					'__PRELOADED_STATE__',
					'__app_config__',
					'__preloaded_state__',
					'__webpack_public_path__',
					'__webpack_nonce__',
				],
				allowAfterThis: true,
				allowAfterSuper: false,
				enforceInMethodNames: false,
			},
		],
		'no-use-before-define': [
			'error',
			{
				...airbnbBaseVariableRules['no-use-before-define'][1],
				functions: false,
			},
		],
		quotes: [
			'error',
			'single',
			{
				allowTemplateLiterals: false,
				avoidEscape: true,
			},
		],
		'sort-imports': 'off',
		'sort-keys-fix/sort-keys-fix': [
			'error',
			'asc',
			{ caseSensitive: false, natural: true },
		],
	},
	overrides: [
		{
			files: ['**/{spec,test}/**', '**/*.{spec,test}.*'],
			env: {
				jasmine: true,
				jest: true,
			},
		},
	],
	settings: {
		'import/parsers': {
			'@babel/eslint-parser': ['.js'],
		},
		'import/resolver': {
			node: {
				extensions: [...IMPORT_EXTENSIONS, '.json'],
			},
		},
		'import/extensions': IMPORT_EXTENSIONS,
	},
};
