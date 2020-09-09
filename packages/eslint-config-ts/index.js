const mergeWith = require('lodash.mergewith');
const omit = require('lodash.omit');

const tsPluginBaseConfig = require('@typescript-eslint/eslint-plugin/dist/configs/base.json');
const tsPluginRecommendedConfig = require('@typescript-eslint/eslint-plugin/dist/configs/recommended.json');
const tsPrettierConfig = require('eslint-config-prettier/@typescript-eslint');
const airbnbBaseStyleConfig = require('eslint-config-airbnb-base/rules/style');
const jsConfigOverrides = require('@bernardmcmanus/eslint-config-js');

const tsPluginConfig = omit(
	mergeWith(
		{},
		tsPluginBaseConfig,
		tsPluginRecommendedConfig,
		{
			plugins: ['typescript-sort-keys']
		},
		(objValue, srcValue) => {
			if (
				Array.isArray(objValue) &&
				objValue.every(v => typeof v === 'string')
			) {
				return Array.from(new Set(objValue.concat(srcValue)));
			}
		}
	),
	['extends']
);

const spacedCommentRule = airbnbBaseStyleConfig.rules['spaced-comment'];
const spacedCommentConfig = spacedCommentRule.slice(0, -1);
const [spacedCommentOptions] = spacedCommentRule.slice(-1);

const IMPORT_EXTENSIONS = Object.freeze(['.js', '.ts']);

module.exports = {
	extends: ['@bernardmcmanus/eslint-config-js', 'prettier/@typescript-eslint'],
	overrides: [
		{
			...tsPluginConfig,
			files: ['**/*.ts'],
			rules: {
				...jsConfigOverrides.rules,
				...tsPluginConfig.rules,
				...tsPrettierConfig.rules,
				'@typescript-eslint/explicit-function-return-type': [
					'error',
					{ allowExpressions: true }
				],
				'@typescript-eslint/member-delimiter-style': [
					'error',
					{
						multiline: {
							delimiter: 'semi',
							requireLast: true
						},
						singleline: {
							delimiter: 'semi',
							requireLast: false
						}
					}
				],
				'@typescript-eslint/no-empty-function': 'off',
				'@typescript-eslint/no-empty-interface': 'warn',
				'@typescript-eslint/no-explicit-any': 'error',
				'@typescript-eslint/no-non-null-assertion': 'off',
				'@typescript-eslint/no-unused-vars': [
					'error',
					{
						argsIgnorePattern: '^_'
					}
				],
				'typescript-sort-keys/interface': 'error',
				'typescript-sort-keys/string-enum': 'error'
			}
		},
		{
			files: ['**/*.d.ts'],
			rules: {
				/**
				 * Disable certain rules for type definition files
				 */
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
								new Set(['/', ...spacedCommentOptions.line.markers])
							)
						}
					}
				],
				'vars-on-top': 'off'
			}
		}
	],
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts']
		},
		'import/resolver': {
			node: {
				extensions: [...IMPORT_EXTENSIONS, '.json']
			}
		},
		'import/extensions': IMPORT_EXTENSIONS
	}
};
