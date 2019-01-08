'use strict';

const Listr = require('listr');
const buildSass = require('./build-sass');
const nodeSass = require('node-sass');

module.exports = function (cfg) {
	cfg = cfg || {};
	const config = cfg.flags || {};
	config.cwd = config.cwd || process.cwd();
	return new Listr([{
		title: 'Compiling Sass',
		task: (context, task) => {
			// Only include sass warnings with the verbose flag.
			if (!config.verbose) {
				let output = '';
				config.sassFunctions = {
					'@warn': function (warning) {
						if (output) {
							output += '\n' + warning.getValue().replace(/\n/g, ' ');
						} else {
							output = warning.getValue().replace(/\n/g, ' ');
						}
						task.output = output;
						return nodeSass.NULL;
					}
				};
			}
			return buildSass(config);
		},
	}], {
		renderer: require('../helpers/listr-renderer')
	}).run();
};

module.exports.watchable = true;
