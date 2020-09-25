module.exports = ({ use = [], ...rest } = {}) => ({
	test: /\.jsx?$/,
	use: [
		{
			loader: require.resolve('thread-loader')
		},
		{
			loader: require.resolve('babel-loader'),
			options: {
				configFile: true,
				presets: [
					[
						require.resolve('@bernardmcmanus/babel-preset-react'),
						{
							browser: true,
							env: {
								modules: false
							}
						}
					]
				]
			}
		},
		...use
	],
	...rest
});
