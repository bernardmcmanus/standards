# Standards

> Coding standards and packages

## Development workflow

1. Make your changes and submit a pull request. DO NOT bump package versions.

2. Once your pull request has been approved and merged:

   ```bash
   # Fetch the latest from upstream
   git fetch upstream

   # Switch to master
   git checkout master

   # Hard reset to upstream/master
   git reset --hard upstream/master
   ```

3. Run `npx lerna version` to bump versions for changed packages

## Install dependencies

```bash
npm i
```

## Bump package versions

```bash
# NOTE: This will create a new commit and push directly to upstream!
npx lerna version [target]
```

## Build and Test

```bash
make
```

## Publish

```bash
make publish
```
