/* eslint-disable @ironnet_cyber/no-extraneous-dependencies */
require('js-yaml');

const config = require('config');

// eslint-disable-next-line no-console
console.log(JSON.stringify(config.util.toObject()));
