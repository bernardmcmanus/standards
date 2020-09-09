# @bernardmcmanus/eslint-plugin

> Custom eslint rules

## Usage

1. Install `@bernardmcmanus/eslint-plugin`:

    ```
    npm i @bernardmcmanus/eslint-plugin -D
    ```

2. Extend `@bernardmcmanus/eslint-plugin` in your project's eslint config:

    ```js
    module.exports = {
        extends: [
            'plugin:@bernardmcmanus/eslint-plugin/default'
        ],
        settings: {
            /**
             * OPTIONAL: Configure your project as a monorepo
             */
            '@bernardmcmanus/no-extraneous-dependencies': {
                monorepo: true
            }
        }
    };
    ```
