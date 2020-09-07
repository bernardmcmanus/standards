# @bernardmcmanus/tsconfig

> Common Typescript configuration

## Usage

1. Install `@bernardmcmanus/tsconfig`:

    ```
    npm i @bernardmcmanus/tsconfig -S
    ```

2. <br/>

    a. _`TypeScript`_ - extend `@bernardmcmanus/tsconfig` in your project's `tsconfig.json`:

    ```js
    {
        "extends": "@bernardmcmanus/tsconfig",
        "exclude": ["coverage", "dist"],
        // Additional configuration as needed
        // ...
    }
    ```

    b. _`TypeScript React`_ - extend `@bernardmcmanus/tsconfig/react` in your project's `tsconfig.json`:

    ```js
    {
        "extends": "@bernardmcmanus/tsconfig/react",
        "exclude": ["coverage", "dist"],
        // Additional configuration as needed
        // ...
    }
    ```
