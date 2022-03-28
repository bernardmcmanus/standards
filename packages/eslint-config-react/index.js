let reactVersion;
try {
	({ version: reactVersion } = require('react/package.json'));
} catch (err) {
	if (err.code !== 'MODULE_NOT_FOUND') {
		throw err;
	}
	console.warn('WARN: Could not determine react version');
}

const IMPORT_EXTENSIONS = Object.freeze(['.js', '.jsx', '.ts', '.tsx']);

module.exports = {
	extends: [
		'airbnb',
		'@bernardmcmanus/eslint-config-ts',
		'prettier',
	],
	env: {
		browser: true
	},
	plugins: ['react', 'react-hooks'],
	rules: {
		/**
		 * jsx-a11y/label-has-for is deprecated in favor of jsx-a11y/label-has-associated-control
		 * @see https://git.io/fjZLz
		 */
		'jsx-a11y/label-has-for': 'off',
		'jsx-a11y/label-has-associated-control': [
			"error",
			{
				"labelComponents": [],
				"labelAttributes": [],
				"controlComponents": [],
				"assert": "both",
				"depth": 25
			}
		],
		'max-classes-per-file': ['error', 1],
		'react/function-component-definition': [
			'error',
			{
				namedComponents: [
					'arrow-function',
					'function-declaration',
					'function-expression'
				],
				unnamedComponents: [
					'arrow-function',
					'function-expression',
				]
			}
		],
		'react/jsx-filename-extension': [
			'error',
			{ extensions: ['.jsx', '.tsx'] }
		],
		'react/jsx-fragments': ['error', 'syntax'],
		'react/jsx-indent': 'off',
		'react/jsx-indent-props': 'off',
		'react/jsx-no-useless-fragment': ['error', {
			allowExpressions: true,
		}],
		'react/jsx-props-no-spreading': 'off',
		'react/jsx-sort-props': [
			'error',
			{
				ignoreCase: true,
				callbacksLast: true,
				shorthandFirst: true,
				reservedFirst: true
			}
		],
		'react/jsx-wrap-multilines': [
			'error',
			{
				declaration: 'parens-new-line',
				assignment: 'parens-new-line',
				return: 'parens-new-line',
				arrow: 'parens-new-line',
				condition: 'parens-new-line',
				logical: 'parens-new-line',
				prop: 'ignore',
			}
		],
		'react/no-unstable-nested-components': [
			'error',
			{ allowAsProps: true },
		],
		'react/prefer-stateless-function': 'error',
		'react/sort-comp': 'off',
		'react/state-in-constructor': ['error', 'never'],
		'react/static-property-placement': ['error', 'static public field'],
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'error'
	},
	overrides: [
		{
			files: ['**/*.tsx'],
			rules: {
				/**
				 * Disable certain react rules for TypeScript
				 */
				'react/prop-types': 'off',
				'react/default-props-match-prop-types': 'off',
				'react/forbid-prop-types': 'off',
				'react/require-default-props': 'off'
			}
		}
	],
	settings: {
		'import/parsers': {
			'@babel/eslint-parser': ['.js', '.jsx'],
			'@typescript-eslint/parser': ['.ts', '.tsx']
		},
		'import/resolver': {
			node: {
				extensions: [...IMPORT_EXTENSIONS, '.json']
			}
		},
		'import/extensions': IMPORT_EXTENSIONS,
		react: {
			version: reactVersion
		}
	}
};
