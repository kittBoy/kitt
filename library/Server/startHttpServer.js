/**
 * 配置和启动express
 *
 * @api private
 * */

module.exports = function (Mkcms, app, callback) {

    var host = Mkcms.get('host');
    var port = Mkcms.get('port') || 3000;
    var message = Mkcms.get('name') + 'is ready on';

    function ready( err) {
        callback(err, message);
    }

    if (host) {
        message += 'http://' + host + ':' + port;
        Mkcms.httpServer = app.listen(port, host, ready);
    }else {
        message += 'port' + port;
        Mkcms.httpServer = app.listen(port || 3000, ready);
    }

};