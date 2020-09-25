module.exports = (_, opts) => ({
	presets: [
		['@bernardmcmanus/babel-preset-ts', opts],
		'@babel/preset-react'
	]
});
