module.exports = ({ use = [], ...rest } = {}) => ({
	test: /\.(eot|ttf|woff2?)$/,
	use: [
		{
			loader: require.resolve('file-loader')
		},
		...use
	],
	...rest
});
