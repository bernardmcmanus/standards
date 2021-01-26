const Path = require('path');

const { DefinePlugin, DllReferencePlugin, ProgressPlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const hash = require('object-hash');
const once = require('lodash/once');
const pickBy = require('lodash/pickBy');
const throttle = require('lodash/throttle');

const configLoader = require('./lib/config-loader');
const createCssRule = require('./rules/css');
const createScssRule = require('./rules/scss');
const createFontRule = require('./rules/font');
const createImageRule = require('./rules/image');
const createBabelRule = require('./rules/babel');
const createTscRule = require('./rules/tsc');
const createSvgRule = require('./rules/svg');
const {
	development,
	env,
	getManifests,
	production,
	tryCatch
} = require('./lib/helpers');

const hasDllBuild = once(() => {
	const { entry } = require('./dll');
	return Object.keys(entry).length > 0;
});

module.exports = configLoader('app', {
	devtool: `${production('hidden') || 'eval'}-source-map`,
	entry: [Path.resolve('src/index.tsx')],
	output: {
		path: Path.resolve('dist/static/app'),
		publicPath: '/static/app/',
		...(production({
			filename: '[contenthash].js',
			chunkFilename: '[contenthash].js'
		}) || {
			filename: '[hash].js',
			chunkFilename: '[chunkhash].js'
		})
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx']
	},
	mode: env,
	optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
				sourceMap: true
			}),
			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: {
					map: {
						inline: false,
						annotations: true
					}
				}
			})
		],
		runtimeChunk: false,
		splitChunks: pickBy(
			{
				automaticNameDelimiter: '_',
				cacheGroups: {
					vendors: {
						priority: 10,
						test: ({ userRequest }) => /\/node_modules\//.test(userRequest)
					},
					common: {
						priority: 10,
						test: ({ userRequest }) => !/\/node_modules\//.test(userRequest)
					},
					default: {
						priority: 0,
						reuseExistingChunk: true
					}
				},
				chunks: 'all',
				maxInitialRequests: 5,
				minSize: production(1e5),
				maxSize: production(2.5e5),
				name: development()
			},
			Boolean
		)
	},
	stats: {
		colors: true,
		entrypoints: false,
		modules: false,
		excludeAssets: assetName => !/\.(css|js|html)$/.test(assetName)
	},
	plugins: [
		development(
			new HardSourceWebpackPlugin({
				cachePrune: {
					maxAge: 1.728e8 /* 2d */,
					sizeThreshold: 200 * 1024 * 1024 /* 200MB */
				},
				configHash: wpConfig => {
					try {
						const config = require('config');
						const appConfig = config.util.toObject();
						return hash(
							{ appConfig, wpConfig },
							{ algorithm: 'sha1', ignoreUnknown: true }
						);
					} catch (err) {
						if (err.code !== 'MODULE_NOT_FOUND') {
							throw err;
						}
						return hash(wpConfig, { algorithm: 'sha1', ignoreUnknown: true });
					}
				}
			})
		),
		development(
			new HardSourceWebpackPlugin.ExcludeModulePlugin([
				{
					test: /[\\/]\.DS_Store([\\/]|$)/
				},
				{
					test: /[\\/]mini-css-extract-plugin[\\/]/
				}
			])
		),
		new DefinePlugin({ 'process.browser': true }),
		new ProgressPlugin(
			development(
				throttle((percent, ...rest) => {
					console.log(`${`[webpack.Progress] ${Math.floor(percent * 10) * 10}%`.padEnd(14, ' ')} ${rest.join(' ')}`);
				}, 50)
			)
		),
		...(hasDllBuild()
			? getManifests().map(manifest => new DllReferencePlugin({ manifest }))
			: []),
		new HtmlWebpackPlugin({
			minify: production({
				removeComments: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true
			}),
			template: 'src/index.html',
		}),
		hasDllBuild() &&
			new HtmlWebpackTagsPlugin({
				links: tryCatch(
					() => require(Path.resolve('dist/static/dll/css.json')),
					[]
				).map(({ url }) => ({ append: false, path: url, usePublicPath: false })),
				scripts: tryCatch(
					() => require(Path.resolve('dist/static/dll/js.json')),
					[]
				).map(({ url }) => ({ append: false, path: url, usePublicPath: false })),
			}),
		new MiniCssExtractPlugin({
			filename: '[contenthash].css',
			chunkFilename: '[contenthash].css'
		}),
		production(
			new BundleAnalyzerPlugin({
				analyzerMode: 'static',
				reportFilename: '.report.html',
				openAnalyzer: false
			})
		)
	].filter(Boolean),
	module: {
		rules: [
			createTscRule({
				options: {
					transpileOnly: development()
				}
			}),
			createBabelRule({
				exclude: /\/(node_modules)\/.+\.js$/
			}),
			createFontRule(),
			createImageRule(),
			createSvgRule(),
			createCssRule(),
			createScssRule()
		]
	}
});
