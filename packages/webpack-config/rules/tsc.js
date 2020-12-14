module.exports = ({ use = [], ...rest } = {}) => ({
	test: /(\.d)?\.tsx?$/,
	use: [
		{
			loader: require.resolve('ts-loader')
		},
		...use
	],
	...rest
});
