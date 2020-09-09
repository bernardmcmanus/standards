# @bernardmcmanus/lint-staged-config

> Custom lint-staged configuration

## Usage

1. Install `@bernardmcmanus/lint-staged-config`:

    ```
    npm i @bernardmcmanus/lint-staged-config -D
    ```

2. <br/>

    a. _Simple_ - add the following to your project's `.huskyrc.js`:

    ```js
    module.exports = {
        hooks: {
            'pre-commit': 'lint-staged --config @bernardmcmanus/lint-staged-config'
        }
    };
    ```

    b. _Advanced_ - extend `@bernardmcmanus/lint-staged-config` in your project's `lint-staged.config.js`:

    ```js
    module.exports = {
        ...require('@bernardmcmanus/lint-staged-config'),
        // ...
    };
    ```
