module.exports = function bindLessMiddleware (kitt, app) {
	// the less option can be a single path, or array of paths
	// when set, we configure the less middleware
	var lessPaths = kitt.get('less');
	var lessOptions = kitt.get('less options') || {};

	if (typeof lessPaths === 'string') {
		lessPaths = [lessPaths];
	}

	if (Array.isArray(lessPaths)) {
		lessPaths.forEach(function (path) {
			app.use(require('less-middleware')(kitt.expandPath(path), lessOptions));
		});
	}
};
