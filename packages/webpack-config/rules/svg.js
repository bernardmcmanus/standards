const createImageRule = require('./image');

module.exports = opts => ({
	test: /\.svg$/,
	oneOf: [
		{
			resourceQuery: /inline/,
			use: {
				loader: require.resolve('svg-inline-loader'),
				options: {
					removeTags: true,
					removingTags: ['desc', 'fill', 'title']
				}
			}
		},
		{
			use: createImageRule(opts).use
		}
	]
});
