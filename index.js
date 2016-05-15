var _ = require('lodash');
var express = require('express');
var fs = require('fs');
var grappling = require('grappling-hook');
var path = require('path');



var moduleRoot = (function (_rootPath) {
    var parts = _rootPath.split(path.sep);
    parts.pop();
    return parts.join(path.sep);
})(module.parent ? module.parent.paths[0] : module.paths[0]);



/*
* kitt Class
*
* @api public
*/

var Kitt = function () {
	grappling.mixin(this).allowHooks('pre:static', 'pre:bodyparser', 'pre:session', 'pre:routes', 'pre:render', 'updates', 'signout', 'signin', 'pre:logger');
    this.paths = {};
    this.lists = {};
    this._options = {
        'name': 'Kitt',
        'compress': true,
        'logger': ':method :url :status :response-time ms',
        'auto update': false,
        'module root': moduleRoot
    };



    //导入express
    this.express = express();

    this.set('env', process.env.NODE_ENV || 'development');

    this.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT);
    this.set('host', process.env.HOST || process.env.IP || process.env.OPENSHIFT_NODEJS_IP);
    this.set('listen', process.env.LISTEN);

    this.set('ssl', process.env.SSL);
    this.set('ssl port', process.env.SSL_PORT);
    this.set('ssl host', process.env.SSL_HOST || process.env.SSL_IP);
    this.set('ssl key', process.env.SSL_KEY);
    this.set('ssl cert', process.env.SSL_CERT);
    this.set('cookie secret', process.env.COOKIE_SECRET);
    this.set('allowed ip ranges', process.env.ALLOWED_IP_RANGES);
}

_.assignIn(Kitt.prototype, require('./library/org/options'));


/*绑定方法到Kitt.prototype*/
Kitt.prototype.importer = require('./library/kitt/importer');
Kitt.prototype.initDatabase = require('./library/kitt/db/initDatabase');
Kitt.prototype.initExpressApp = require('./library/kitt/initExpressApp');
Kitt.prototype.initExpressSession = require('./library/kitt/initExpressSession');
Kitt.prototype.init = require('./library/kitt/init');

Kitt.prototype.openDatabaseConnection = require('./library/kitt/db/openDatabaseConnection');
Kitt.prototype.render = require('./library/kitt/render');
Kitt.prototype.start = require('./library/kitt/start');

Kitt.prototype.import = function (dirname) {

    var initialPath = path.join(this.get('module root'), dirname);

    var doImport = function (fromPath) {

        var imported = {};

        fs.readdirSync(fromPath).forEach(function (name) {

            var fsPath = path.join(fromPath, name);
            var info = fs.statSync(fsPath);

            // recur
            if (info.isDirectory()) {
                imported[name] = doImport(fsPath);
            } else {
                // only import files that we can `require`
                var ext = path.extname(name);
                var base = path.basename(name, ext);
                if (require.extensions[ext]) {
                    imported[base] = require(fsPath);
                }
            }

        });

        return imported;
    };

    return doImport(initialPath);
};
Kitt.prototype.profixModel = function (key) {
    var modelPrefix = this.get('model prefix');

    if (modelPrefix) {
        key = modelPrefix + '_' + key;
    }

    return require('mongoose/lib/utils').toCollectionName(key);
};
/**
 * 导出Kitt实例
 *
 * @api public
 */
var kitt = module.exports = new Kitt();

kitt.Model = require('./library/kitt/model/model')
kitt.Kitt=Kitt;
kitt.security = {
    csrf: require('./library/kitt/security/csrf'),
};

/**
 * 导入客户端models
 *
 * ####Example:
 *
 *     var models = kitt.import('models');
 *
 * @param {String} dirname
 * @api public
 */
/**
 * Applies Application updates
 */

Kitt.prototype.applyUpdates = function (callback) {
	var self = this;
	self.callHook('pre:updates', function (err) {
	/*	if (err) return callback(err);
		require('./lib/updates').apply(function (err) {
			if (err) return callback(err);
			self.callHook('post:updates', callback);
		});*/
	});
};

//导出模块和类
kitt.View = require('./library/kitt/view');
kitt.version = require('./package.json').version;
