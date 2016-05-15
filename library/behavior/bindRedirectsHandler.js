module.exports = function bindErrorHandlers (kitt, app) {
	if (Object.keys(kitt._redirects).length) {
		app.use(function (req, res, next) {
			if (kitt._redirects[req.path]) {
				res.redirect(kitt._redirects[req.path]);
			} else {
				next();
			}
		});
	}
};
