# @bernardmcmanus/babel-preset-ts

> Common babel configuration for TypeScript projects

## Usage

1. Install `@bernardmcmanus/babel-preset-ts`:

    ```
    npm i @bernardmcmanus/babel-preset-ts -D
    ```

2. <br/>

    a. _Simple_ - Add `@bernardmcmanus/babel-preset-ts` to your project's `babel.config.js`:

    ```js
    module.exports = {
        presets: [
            [
                '@bernardmcmanus/babel-preset-ts',
                /**
                 * An options object for @babel/preset-typescript
                 * Default values are shown below
                 * @see https://babeljs.io/docs/en/babel-preset-typescript#options
                 */
                typescript: {
                    allowNamespaces: true
                }
            ]
        ]
    };
    ```

    b. _Advanced_ - See [`@bernardmcmanus/babel-preset-js`](https://github.com/bernardmcmanus/standards/tree/master/packages/babel-preset-js#usage) for advanced configuration options

## Example Configurations

See [`@bernardmcmanus/babel-preset-js`](https://github.com/bernardmcmanus/standards/tree/master/packages/babel-preset-js#example-configurations) for example configurations

## Presets and Plugins
                                                                                
| Name                             | Description                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| `@bernardmcmanus/babel-preset-js` | https://github.com/bernardmcmanus/standards/tree/master/packages/babel-preset-js |
| `@babel/preset-typescript`       | https://babeljs.io/docs/en/babel-preset-typescript                                         |
