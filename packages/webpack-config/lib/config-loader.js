const Path = require('path');

const interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

let webpackConfigLoaderPath;

try {
	webpackConfigLoaderPath = require.resolve(
		Path.join(process.cwd(), 'webpack.config')
	);
} catch (err) {
	if (err.code !== 'MODULE_NOT_FOUND') {
		throw err;
	}
}

module.exports = (key, webpackConfig) => {
	let configKey = key;
	let loader;

	if (webpackConfigLoaderPath) {
		const wpConfigExports = interopRequireWildcard(require(webpackConfigLoaderPath));

		if (
			configKey === 'app'
				&& !wpConfigExports[configKey]
				&& typeof wpConfigExports.default === 'function'
		) {
			configKey = 'default';
		}

		({ [configKey]: loader } = wpConfigExports);
	}

	if (!loader) {
		loader = ({ config }) => config;
	}

	return loader({ config: webpackConfig }) || webpackConfig;
};
