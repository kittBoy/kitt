/**
 * 配置和启动express server SSL
 *
 * @api private
 *
 */

var https = require('https');
var tls = require('tls');
var fs = require('fs');

module.exports = function (Mkcms, app, created, callback) {
    var ssl = Mkcms.get('ssl');
    var host = Mkcms.get('ssl host');
    var port = Mkcms.get('ssl port');
    var message = (ssl === 'only') ? Mkcms.get('name') + '(SSL) is ready on' : 'SSL Server is ready on';
    var sniFunc;

    var options = Mkcms.get('https server options') || [];
    if (Mkcms.get('ssl cert') && fs.existsSync(Mkcms.getPath('ssl cert'))) {
        options.cert = fs.readFileSync(Mkcms.getPath('ssl cert'));
    }
    if (Mkcms.get('ssl key') && fs.existsSync(Mkcms.getPath('ssl key'))) {
        options.key = fs.readFileSync(Mkcms.getPath('ssl key'));
    }
    if (Mkcms.get('ssl ca') && fs.existsSync(Mkcms.getPath('ssl ca'))) {
        options.ca = fs.readFileSync(Mkcms.getPath('ssl ca'));
    }
    if (Mkcms.get('ssl pfx') && fs.existsSync(Mkcms.getPath('ssl pfx'))) {
        options.pfx = fs.readFileSync(Mkcms.getPath('ssl pfx'));
    }
    if (Mkcms.get('ssl cert data')) {
        options.cert = Mkcms.get('ssl cert');
    }
    if (Mkcms.get('ssl key data')) {
        options.key = Mkcms.get('ssl key');
    }
    if (Mkcms.get('ssl ca data')) {
        options.ca = Mkcms.get('ssl ca');
    }
    if (Mkcms.get('ssl pfx data')) {
        options.pfx = Mkcms.get('ssl pfx');
    }


}

