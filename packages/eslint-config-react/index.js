const { version: reactVersion } = require('react/package.json');

const IMPORT_EXTENSIONS = Object.freeze(['.js', '.jsx', '.ts', '.tsx']);

module.exports = {
	extends: [
		'airbnb',
		'@bernardmcmanus/eslint-config-ts',
		'prettier/@typescript-eslint',
	],
	env: {
		browser: true
	},
	plugins: ['react-hooks'],
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
		'react/jsx-filename-extension': [
			'error',
			{ extensions: ['.jsx', '.tsx'] }
		],
		'react/jsx-fragments': ['error', 'syntax'],
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
			'babel-eslint': ['.js', '.jsx'],
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
