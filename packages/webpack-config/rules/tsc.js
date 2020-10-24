module.exports = ({ use = [], ...rest } = {}) => ({
	test: /(\.d)?\.tsx?$/,
	use: [
		{
			loader: require.resolve('ts-loader'),
			options: {
				compilerOptions: {
					declaration: false,
					module: 'esnext',
					target: 'es2020'
				}
			}
		},
		...use
	],
	...rest
});
