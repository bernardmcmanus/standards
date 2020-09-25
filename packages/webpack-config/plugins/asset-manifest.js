module.exports = class AssetManifestPlugin {
	constructor({
		assets: assetFilter = () => true,
		chunks: chunkFilter = () => true,
		...options
	} = {}) {
		if (!options.filename) {
			throw new Error('options.filename is required');
		}
		this.options = { ...options, assetFilter, chunkFilter };
	}

	apply(compiler) {
		const { filename, assetFilter, chunkFilter } = this.options;
		compiler.hooks.emit.tapPromise(
			'AssetManifestPlugin',
			async ({ assets, chunks, chunkGroups, options }) => {
				const dependencyChunks = chunkGroups.reduce((acc, chunkGroup) => {
					chunkGroup.chunks.forEach(chunk => {
						if (chunkFilter(chunk, acc)) {
							acc.add(chunk);
						}
					});
					return acc;
				}, new Set());

				const assetList = chunks
					.sort((a, b) => b.id - a.id)
					.reduce((acc, chunk) => {
						if (dependencyChunks.has(chunk)) {
							chunk.files.forEach(name => {
								const url = `${options.output.publicPath}${name}`;
								const asset = { name, url };
								if (assetFilter(asset)) {
									acc.push(asset);
								}
							});
						}
						return acc;
					}, []);

				const assetManifest = JSON.stringify(assetList, null, 2);

				Object.assign(assets, {
					[filename]: {
						source: () => assetManifest,
						size: () => assetManifest.length
					}
				});
			}
		);
	}
};
