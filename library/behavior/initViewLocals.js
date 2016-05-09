var assign = require('object-assign');

module.exports = function initTrustProxy (kitt, app) {
	// 挂载系统locals
	if (typeof kitt.get('locals') === 'object') {
		assign(app.locals, kitt.get('locals'));
	}

	// 在生产环境下使用 "pretty html"
	if (kitt.get('env') !== 'production') {
		app.locals.pretty = true;
	}
};
