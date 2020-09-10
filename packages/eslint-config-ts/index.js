const airbnbBaseStyleConfig = require('eslint-config-airbnb-base/rules/style');

const IMPORT_EXTENSIONS = Object.freeze(['.js', '.ts']);

const spacedCommentRule = airbnbBaseStyleConfig.rules['spaced-comment'];
const spacedCommentConfig = spacedCommentRule.slice(0, -1);
const [spacedCommentOptions] = spacedCommentRule.slice(-1);

console.log({
	extends: [
		'@bernardmcmanus/eslint-config-js',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier/@typescript-eslint',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module'
	},
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
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
			},
		],
		'@typescript-eslint/prefer-includes': 'error',
		// Enable when these are fixable
		// '@typescript-eslint/prefer-nullish-coalescing': 'error',
		// '@typescript-eslint/prefer-optional-chain': 'error',
		'@typescript-eslint/prefer-readonly': 'error',
		'@typescript-eslint/prefer-reduce-type-parameter': 'error',
		'@typescript-eslint/prefer-string-starts-ends-with': 'error',
		'typescript-sort-keys/interface': 'error',
		'typescript-sort-keys/string-enum': 'error',
	},
	overrides: [
		{
			files: ['**/*.ts'],
			rules: {
				'@typescript-eslint/explicit-member-accessibility': 'error',
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
			files: ['{spec,test}/**'],
			rules: {
				'@typescript-eslint/no-non-null-assertion': 'off',
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
});
