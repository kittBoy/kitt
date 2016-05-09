module.exports = function bindSessionMiddleware (kitt, app) {

	app.use(kitt.get('session options').cookieParser);

	// pre:session hooks
	if (typeof kitt.get('pre:session') === 'function') {
		kitt.get('pre:session')(app);
	}
	app.use(function (req, res, next) {
		kitt.callHook('pre:session', req, res, next);
	});

	app.use(kitt.expressSession);
	app.use(require('connect-flash')());



};
