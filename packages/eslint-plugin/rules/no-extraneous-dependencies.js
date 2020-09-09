const Path = require('path');
const fs = require('fs');

const get = require('lodash.get');
const memoize = require('lodash.memoize');
const parent = require('eslint-plugin-import/lib/rules/no-extraneous-dependencies');

const dirHasPackageJSON = memoize(dir => {
	const pkg = Path.join(dir, 'package.json');
	return fs.existsSync(pkg);
});

function createPackageDirSet(input) {
	const result = new Set();
	const values = Array.isArray(input) ? input : [input];
	values.forEach(v => {
		if (v) {
			result.add(Path.resolve(v));
		}
	});
	return result;
}

module.exports = {
	...parent,
	create(context) {
		if (!get(context, ['settings', '@bernardmcmanus/no-extraneous-dependencies', 'monorepo'])) {
			// No special configuration needed
			return parent.create(context);
		}

		const [originalOpts = {}] = context.options;
		const packageDir = createPackageDirSet(originalOpts.packageDir);
		let dir = Path.dirname(context.getFilename());

		while (!/^\.\./.test(Path.relative(process.cwd(), dir))) {
			if (dirHasPackageJSON(dir)) {
				packageDir.add(dir);
			}
			dir = Path.dirname(dir);
		}

		context.options[0] = {
			...originalOpts,
			packageDir: Array.from(packageDir)
		};

		// Create the rule object using modified options
		const result = parent.create(context);

		// Reset context options to the original value
		context.options[0] = originalOpts;

		return result;
	}
};
