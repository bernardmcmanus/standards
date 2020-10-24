module.exports = ({ use = [], ...rest } = {}) => ({
	test: /(\.d)?\.tsx?$/,
	use: [
		{
			loader: require.resolve('ts-loader'),
			options: {
				compilerOptions: {
					module: 'esnext',
					noEmit: true,
					target: 'es2020'
				}
			}
		},
		...use
	],
	...rest
});
