var debug = require('debug')('kitt:bindIpRestrictions');

module.exports = function bindIPRestrictions (kitt, app) {
	// 检查IP限制
	if (kitt.get('allowed ip ranges')) {
		if (!app.get('trust proxy')) {
			console.log(
				'KittJS Initialisaton Error:\n\n'
				+ 'to set IP range restrictions the "trust proxy" setting must be enabled.\n\n'
			);
			process.exit(1);
		}
		debug('adding IP ranges', kitt.get('allowed ip ranges'));
		app.use(require('../lib/security/ipRangeRestrict')(
			kitt.get('allowed ip ranges'),
			kitt.wrapHTMLError
		));
	}
};
