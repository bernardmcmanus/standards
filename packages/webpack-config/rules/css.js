const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pickBy = require('lodash/pickBy');

const getLocalIdent = require('../lib/getCSSModuleLocalIdent');
const { development, production } = require('../lib/helpers');

module.exports = ({ use = [], ...rest } = {}) => ({
	test: /\.css$/,
	use: [
		{
			loader:
				production(MiniCssExtractPlugin.loader) ||
				require.resolve('style-loader')
		},
		{
			loader: require.resolve('css-loader'),
			options: {
				importLoaders: 1,
				modules: pickBy(
					{
						exportLocalsConvention: 'camelCase',
						getLocalIdent: development(getLocalIdent) || undefined
					},
					value => value !== undefined
				),
				sourceMap: true
			}
		},
		{
			loader: require.resolve('postcss-loader'),
			options: {
				sourceMap: true
			}
		},
		...use
	],
	...rest
});
