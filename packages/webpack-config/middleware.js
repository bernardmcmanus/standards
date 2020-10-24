const koaWebpack = require('koa-webpack');
const rimraf = require('rimraf');
const webpack = require('webpack');

const webpackConfig = require('./app');
const { tryCatch } = require('./lib/helpers');
const pkg = require('./package.json');

const nodemonSignal = tryCatch(() => {
	try {
		require('@bernardmcmanus/npm-scripts/nodemon').signal;
	} catch (err) {
		const nodemonConfigPath = require.resolve('./nodemon.json', {
			paths: [
				process.cwd()
			]
		});
		return require(nodemonConfigPath).signal;
	}
}, 'SIGUSR2');

module.exports = async ({
	serverPort,
	clientPort = serverPort,
	logger = console,
	server
}) => {
	if (!serverPort) {
		throw new Error('options.serverPort is required');
	}

	if (!server) {
		throw new Error('options.server is required');
	}

	const handleCompilationFailure = (errors, restart) => {
		errors.forEach(err => {
			logger.error(err);
		});
		// Dump the hardsource cache if compilation fails
		rimraf.sync('node_modules/.cache/hard-source');
		if (restart) {
			// Optionally signal nodemon to restart the process
			process.kill(process.pid, nodemonSignal);
		}
	};

	const compiler = webpack(webpackConfig);

	compiler.hooks.hardSourceLog.tap(pkg.name, ({ data, level }) => {
		if (level === 'error' || data.error) {
			handleCompilationFailure([data.error], true);
		}
	});

	compiler.hooks.done.tap(pkg.name, ({ compilation }) => {
		if (compilation.errors.length > 0) {
			handleCompilationFailure(compilation.errors);
		}
	});

	compiler.hooks.failed.tap(pkg.name, err => {
		handleCompilationFailure([err], true);
	});

	const middleware = await koaWebpack({
		compiler,
		devMiddleware: {
			stats: {
				assets: false,
				colors: true,
				modules: false
			}
		},
		hotClient: {
			port: {
				client: clientPort,
				server: serverPort
			},
			server
		}
	});

	server.once('close', () => {
		middleware.close();
	});

	return middleware;
};
