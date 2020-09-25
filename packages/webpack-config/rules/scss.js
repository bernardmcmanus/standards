const createCssRule = require('./css');

module.exports = ({ use = [], ...rest } = {}) => createCssRule({
	test: /\.scss$/,
	use: [
		{
			loader: require.resolve('resolve-url-loader'),
			options: {
				root: process.cwd()
			}
		},
		{
			loader: require.resolve('sass-loader'),
			options: {
				sourceMap: true
			}
		},
		...use
	],
	...rest
});
