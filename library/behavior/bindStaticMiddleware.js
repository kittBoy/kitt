var express = require('express');

module.exports = function bindStaticMiddleware (kitt, app) {
	// the static option can be a single path, or array of paths
	// when set, we configure the express static middleware

	var staticPaths = kitt.get('static');
	var staticOptions = kitt.get('static options');

	if (typeof staticPaths === 'string') {
		staticPaths = [staticPaths];
	}

	if (Array.isArray(staticPaths)) {
		staticPaths.forEach(function (value) {
			app.use(express.static(kitt.expandPath(value), staticOptions));
		});
	}
};
