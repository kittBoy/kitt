module.exports = function bindSassMiddleware (kitt, app) {
	// the sass option can be a single path, or array of paths
	// when set, we configure the node-sass middleware

	var sassPaths = kitt.get('sass');
	var sassOptions = kitt.get('sass options') || {};
	var debug = require('debug')('kitt:core:bindSassMiddleware');
	var _ = require('lodash');

	if (typeof sassPaths === 'string') {
		sassPaths = [sassPaths];
	}

	if (Array.isArray(sassPaths)) {
		var sassMiddleware;
		try {
			debug('adding sass');
			sassMiddleware = require('node-sass-middleware');
		} catch (e) {
			if (e.code === 'MODULE_NOT_FOUND') {
				console.error(
					'\nERROR: node-sass not found.\n'
					+ '\nPlease install the node-sass-middleware from npm to use the `sass` option.'
					+ '\nYou can do this by running "npm install node-sass-middleware --save".\n'
				);
				process.exit(1);
			} else {
				throw e;
			}
		}
		var outputStyle = kitt.get('env') === 'production' ? 'compressed' : 'nested';
		sassPaths.forEach(function (path) {
			app.use(sassMiddleware(_.extend({
				src: kitt.expandPath(path),
				dest: kitt.expandPath(path),
				outputStyle: outputStyle,
			}, sassOptions)));
		});
	}
};
