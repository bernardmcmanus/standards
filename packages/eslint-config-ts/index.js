const airbnbBaseStyleConfig = require('eslint-config-airbnb-base/rules/style');

const IMPORT_EXTENSIONS = Object.freeze(['.js', '.ts']);

const spacedCommentRule = airbnbBaseStyleConfig.rules['spaced-comment'];
const spacedCommentConfig = spacedCommentRule.slice(0, -1);
const [spacedCommentOptions] = spacedCommentRule.slice(-1);

module.exports = {
	extends: [
		'@bernardmcmanus/eslint-config-js',
		'plugin:@typescript-eslint/recommended',
		'prettier/@typescript-eslint',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module'
	},
	plugins: [
		'typescript-sort-keys'
	],
	reportUnusedDisableDirectives: true,
	rules: {
		'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
		'@typescript-eslint/explicit-function-return-type': [
			'error',
			{ allowExpressions: true },
		],
		'@typescript-eslint/member-delimiter-style': [
			'error',
			{
				multiline: {
					delimiter: 'semi',
					requireLast: true,
				},
				singleline: {
					delimiter: 'semi',
					requireLast: false,
				},
			},
		],
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-empty-interface': 'warn',
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-shadow': 'error',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
			},
		],

		// Enable when these are fixable
		// '@typescript-eslint/prefer-nullish-coalescing': 'error',
		// '@typescript-eslint/prefer-optional-chain': 'error',

		// These require additional configuration / are incompatible with JS. Disabling for now
		// '@typescript-eslint/prefer-includes': 'error',
		// '@typescript-eslint/prefer-readonly': 'error',
		// '@typescript-eslint/prefer-reduce-type-parameter': 'error',
		// '@typescript-eslint/prefer-string-starts-ends-with': 'error',

		'@typescript-eslint/no-use-before-define': [
			'error',
			{
				functions: false,
				classes: true,
				enums: true,
				typedefs: true,
				variables: true,
				ignoreTypeReferences: true
			}
		],
		'no-shadow': 'off',
		'no-use-before-define': 'off',

		'typescript-sort-keys/interface': 'error',
		'typescript-sort-keys/string-enum': 'error',
	},
	overrides: [
		{
			files: ['**/*.js?(x)'],
			rules: {
				'@typescript-eslint/explicit-function-return-type': 'off',
			},
		},
		{
			files: ['**/*.ts?(x)'],
			rules: {
				'@typescript-eslint/explicit-member-accessibility': 'error'
			},
		},
		{
			files: ['**/*.d.ts'],
			rules: {
				'@typescript-eslint/no-empty-interface': 'off',
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/no-triple-slash-reference': 'off',
				'no-var': 'off',
				'spaced-comment': [
					...spacedCommentConfig,
					{
						...spacedCommentOptions,
						line: {
							...spacedCommentOptions.line,
							// Add exception for TypeScript triple slash directives
							markers: Array.from(
								new Set(['/', ...spacedCommentOptions.line.markers]),
							),
						},
					},
				],
				'vars-on-top': 'off',
			},
		},
		{
			files: ['{dev,scripts,spec,test}/**'],
			rules: {
				'@typescript-eslint/no-non-null-assertion': 'off',
			},
		},
		{
			files: ['{dev,scripts}/**'],
			rules: {
				'@typescript-eslint/no-var-requires': 'off',
				'no-console': 'off'
			},
		},
	],
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts'],
		},
		'import/resolver': {
			node: {
				extensions: [...IMPORT_EXTENSIONS, '.json'],
			},
		},
		'import/extensions': IMPORT_EXTENSIONS,
	},
};
