const Path = require('path');

const { DefinePlugin, DllPlugin, ProgressPlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const pickBy = require('lodash/pickBy');

const AssetManifestPlugin = require('./plugins/asset-manifest');
const configLoader = require('./lib/config-loader');
const createFontRule = require('./rules/font');
const createImageRule = require('./rules/image');
const createTscRule = require('./rules/tsc');
const createSvgRule = require('./rules/svg');
const { env, production } = require('./lib/helpers');

module.exports = configLoader('dll', {
	devtool: `${production('hidden') || 'inline'}-source-map`,
	entry: {
		css: [],
		js: []
	},
	output: {
		path: Path.resolve('dist/static/dll'),
		publicPath: '/static/dll/',
		filename: '[contenthash].js',
		chunkFilename: '[contenthash].js',
		library: '__webpack_dll'
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
		occurrenceOrder: true,
		namedChunks: false,
		runtimeChunk: 'single',
		splitChunks: {
			automaticNameDelimiter: '_',
			cacheGroups: {
				vendors: false,
				css: {
					priority: 10,
					test: /\.css$/
				},
				js: {
					priority: 10,
					test: /\.js$/
				}
			},
			chunks: 'all',
			minSize: 1e5,
			maxSize: 2.5e5,
			name: true
		}
	},
	stats: {
		colors: true,
		entrypoints: false,
		modules: false,
		excludeAssets: assetName => !/\.(css|js|html)$/.test(assetName)
	},
	plugins: [
		new CleanWebpackPlugin({ verbose: true }),
		new DefinePlugin({ 'process.browser': true }),
		new DllPlugin({
			name: '__webpack_dll',
			path: Path.resolve('dist/static/dll/.manifest.[id].json')
		}),
		new ProgressPlugin(),
		new AssetManifestPlugin({
			filename: 'css.json',
			assets: ({ name }) => /\.css$/.test(name),
			chunks: ({ extraAsync, name }) => /(^|_)css(_|$)/.test(name) || (!name && !extraAsync),
		}),
		new AssetManifestPlugin({
			filename: 'js.json',
			assets: ({ name }) => /\.js$/.test(name),
			chunks: ({ extraAsync, name }) => name === 'runtime' || /(^|_)js(_|$)/.test(name) || (!name && !extraAsync),
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
			createTscRule({ test: /\.d\.ts$/ }),
			createFontRule(),
			createImageRule({ enableURLLoader: false }),
			createSvgRule({ enableURLLoader: false }),
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					}
				]
			}
		]
	}
});

module.exports.entry = pickBy(
	module.exports.entry,
	arr => arr.length > 0
);
