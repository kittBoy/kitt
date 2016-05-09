var compression = require('compression');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var morgan = require('morgan');

var createComponentRouter = require('./createComponentRouter');

module.exports = function createApp (kitt, express) {

	if (!kitt.app) {
		if (!express) {
			express = require('express');
		}
		kitt.app = express();
	}

	var app = kitt.app;



	require('../behavior/initTrustProxy')(kitt, app);
	require('../behavior/initViewEngine')(kitt, app);
	require('../behavior/initViewLocals')(kitt, app);
	require('../behavior/bindIPRestrictions')(kitt, app);

	// 压缩响应文件
	if (kitt.get('compress')) {
		app.use(compression());
	}

	// 执行pre:static
	if (typeof kitt.get('pre:static') === 'function') {
		kitt.get('pre:static')(app);
	}
	app.use(function (req, res, next) {
		kitt.callHook('pre:static', req, res, next);
	});

	// 系统图标设置

	if (kitt.get('favico')) {
		app.use(favicon(kitt.getPath('favico')));
	}




	require('../behavior/bindLessMiddleware')(kitt, app);
	require('../behavior/bindSassMiddleware')(kitt, app);
	require('../behavior/bindStylusMiddleware')(kitt, app);
	require('../behavior/bindStaticMiddleware')(kitt, app);
	require('../behavior/bindSessionMiddleware')(kitt, app);

	// 打印请求信息
	if (kitt.get('logger')) {
		app.use(morgan(kitt.get('logger'), kitt.get('logger options')));
	}



	// 客户端logger中间件
	app.use(function (req, res, next) {
		kitt.callHook('pre:logger', req, res, next);
	});



	// Pre bodyparser 中间件
	if (typeof kitt.get('pre:bodyparser') === 'function') {
		kitt.get('pre:bodyparser')(app);
	}
	app.use(function (req, res, next) {
		kitt.callHook('pre:bodyparser', req, res, next);
	});

	require('../behavior/bindBodyParser')(kitt, app);
	app.use(methodOverride());






	// Pre route config
	if (typeof kitt.get('pre:routes') === 'function') {
		kitt.get('pre:routes')(app);
	}
	app.use(function (req, res, next) {
		kitt.callHook('pre:routes', req, res, next);
	});

	// 挂载 React 路由
	if (kitt.get('react routes')) {
		app.use('/', createComponentRouter(kitt.get('react routes')));
	}

	// 配置应用路由
	if (typeof kitt.get('routes') === 'function') {
		kitt.get('routes')(app);
	}




	// Error 配置
	if (typeof kitt.get('pre:error') === 'function') {
		kitt.get('pre:error')(app);
	}
	app.use(function (req, res, next) {
		kitt.callHook('pre:error', req, res, next);
	});
	

	return app;

};
