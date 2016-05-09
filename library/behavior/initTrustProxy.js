module.exports = function initTrustProxy (kitt, app) {
	// 处理 'X-Forwarded-For'请求头
	if (kitt.get('trust proxy') === true) {
		app.enable('trust proxy');
	} else {
		app.disable('trust proxy');
	}
};
