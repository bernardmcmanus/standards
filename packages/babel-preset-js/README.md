# @bernardmcmanus/babel-preset-js

> Common babel configuration for JavaScript projects

## Usage

1. Install `@bernardmcmanus/babel-preset-js`:

    ```
    npm i @bernardmcmanus/babel-preset-js -D
    ```

2. <br/>

    a. _Simple_ - Add `@bernardmcmanus/babel-preset-js` to your project's `babel.config.js`:

    ```js
    module.exports = {
        presets: [
            '@bernardmcmanus/babel-preset-js'
        ]
    };
    ```

    b. _Advanced_ - Configure `@bernardmcmanus/babel-preset-js` in your project's `babel.config.js`:

    ```js
    module.exports = {
        presets: [
            [
                '@bernardmcmanus/babel-preset-js',
                {
                    /**
                     * Optionally use compilation targets specified in a browserslist configuration
                     * @see https://github.com/bernardmcmanus/standards/tree/master/packages/browserslist-config
                     */
                    browser: true,
                    /**
                     * An options object for @babel/preset-env
                     * Default values are shown below
                     * @see https://babeljs.io/docs/en/babel-preset-env#options
                     */
                    env: {
                        targets: {
                            node: 'current'
                        },
                        useBuiltIns: 'usage'
                    }
                }
            ]
        ]
    };
    ```

## Example Configurations

### NodeJS App

```js
module.exports = {
    presets: [
        '@bernardmcmanus/babel-preset-js'
    ]
};
```

### Client App (Webpack)

```js
module.exports = {
    presets: [
        [
            '@bernardmcmanus/babel-preset-js',
            {
                browser: true,
                env: {
                    // Disable module compilation so
                    // webpack can optimize the bundle
                    modules: false
                }
            }
        ]
    ]
};
```

## Presets and Plugins

| Name                                         | Description                                                          |
| -------------------------------------------- | -------------------------------------------------------------------- |
| `@babel/preset-env`                          | https://babeljs.io/docs/en/babel-preset-env                          |
| `@babel/plugin-proposal-class-properties`    | https://babeljs.io/docs/en/babel-plugin-proposal-class-properties    |
| `@babel/plugin-proposal-export-default-from` | https://babeljs.io/docs/en/babel-plugin-proposal-export-default-from |
