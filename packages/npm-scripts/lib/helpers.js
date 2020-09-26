exports.compact = string =>
	string.replace(/[\s\t\n]+/g, ' ').trim();

exports.createExporter = target => (
	(key, get) => {
		Object.defineProperty(target, key, { enumerable: true, get });
		return get;
	}
);
