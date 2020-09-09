module.exports = (_, { typescript, ...opts } = {}) => ({
	presets: [
		['@bernardmcmanus/babel-preset-js', opts],
		['@babel/preset-typescript', {
			allowNamespaces: true,
			...typescript
		}]
	]
});
