# @bernardmcmanus/npm-scripts

> Opinionated scripts for npm projects

## Usage

1. Install `@bernardmcmanus/npm-scripts`:

    ```
    npm i @bernardmcmanus/npm-scripts -D
    ```

2. <br/>

    a. _npx_ - run `npx npm-scripts <identifier> [...args]`:

    ```bash
    npx npm-scripts eslint .
    npx npm-scripts stylelint -- --fix '**/*.css'

    # print help
    npx npm-scripts
    ```

    b. _package.json_ - add `npm-scripts <identifier> [...args]` to package scripts:

    ```json
    {
        "scripts": {
            "build": "npm-scripts babel src"
        }   
    }
    ```
