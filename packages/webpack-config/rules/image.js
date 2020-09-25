const { production } = require('../lib/helpers');

module.exports = ({
	enableURLLoader = production(),
	use = [],
	...rest
} = {}) => ({
	test: /\.(gif|ico|jpe?g|png)$/,
	use: [
		!enableURLLoader && {
			loader: require.resolve('file-loader')
		},
		enableURLLoader && {
			loader: require.resolve('url-loader'),
			options: {
				limit: 1e4
			}
		},
		...use
	].filter(Boolean),
	...rest
});
