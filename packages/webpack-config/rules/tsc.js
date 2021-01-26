module.exports = ({ use = [], options = {}, ...rest } = {}) => ({
	test: /(\.d)?\.tsx?$/,
	use: [
		{
			loader: require.resolve('ts-loader'),
			options
		},
		...use
	],
	...rest
});
