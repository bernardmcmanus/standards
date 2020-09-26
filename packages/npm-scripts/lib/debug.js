const Debug = require('debug');

const pkg = require('../package.json');

module.exports = Debug(pkg.name);
