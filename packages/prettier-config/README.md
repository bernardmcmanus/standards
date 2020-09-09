# @bernardmcmanus/prettier-config
> Common prettier configuration

## Usage
1. Install `@bernardmcmanus/prettier-config`:

    ```
    npm i @bernardmcmanus/prettier-config -D
    ```

2. <br/>

    a. _Simple_ - add `@bernardmcmanus/prettier-config` to your project's `package.json`:

    ```json
    {
        "name": "my-package",
        "version": "1.0.0",
        "prettier": "@bernardmcmanus/prettier-config"
    }
    ```

    b. _Advanced_ - extend `@bernardmcmanus/prettier-config` in your project's `.prettierrc.js`:

    ```js
    module.exports = {
        ...require('@bernardmcmanus/prettier-config'),
        // ...
    };
    ```
