// Configure NODE_PATH so require(...) references bundled node_modules
process.env.NODE_PATH = [process.env.NODE_PATH, ...module.paths].filter(Boolean).join(':');
require("module").Module._initPaths();

// Make sure this is included in the bundle
require('js-yaml');

const config = require('config');

// eslint-disable-next-line no-console
console.log(JSON.stringify(config.util.toObject()));
