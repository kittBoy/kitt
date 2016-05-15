var multer = require('multer');
var bodyParser = require('body-parser');

module.exports = function bindIPRestrictions (kitt, app) {
	// Set up body options and cookie parser
	var bodyParserParams = {};
	if (kitt.get('file limit')) {
		bodyParserParams.limit = kitt.get('file limit');
	}
	app.use(bodyParser.json(bodyParserParams));
	bodyParserParams.extended = true;
	app.use(bodyParser.urlencoded(bodyParserParams));
	app.use(multer({
		includeEmptyFields: true,
	}));
};
