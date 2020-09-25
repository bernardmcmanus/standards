const Path = require('path');
const http = require('http');
const { promisify } = require('util');

const parseArgv = require('yargs-parser');
const Koa = require('koa');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const mount = require('koa-mount');
const serve = require('koa-static');
const logger = require('koa-logger');

const createWebpackMiddleware = require('./middleware');

const {
	_: [port = 3000]
} = parseArgv(process.argv.slice(2));

const app = new Koa();

app.on('error', err => {
	console.error(err);
});

const server = http.createServer(app.callback());

/**
 * Logging middleware
 */
app.use(logger());

/**
 * Static middleware
 */
{
	const childApp = new Koa();
	childApp.use(conditional());
	childApp.use(etag());
	childApp.use(mount('/', serve(Path.resolve('dist/static'))));
	app.use(mount('/static', childApp));
}

/**
 * Webpack middleware
 */
{
	const childApp = new Koa();
	createWebpackMiddleware({
		serverPort: port,
		clientPort: port,
		server
	}).then(middleware => {
		const { fs: mfs } = middleware.devMiddleware.context;
		const readFileAsync = promisify(mfs.readFile.bind(mfs));
		childApp.use(middleware);
		childApp.use(async ctx => {
			ctx.type = 'html';
			ctx.body = await readFileAsync(
				Path.resolve('dist/static/app/index.html')
			);
		});
	});
	app.use(mount('/', childApp));
}

server.listen(port, err => {
	if (err) {
		throw err;
	}
	console.info(`🚀 Listening on ${port}`);
});
