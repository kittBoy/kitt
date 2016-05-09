/**
 * @api private
 */

var fs = require('fs');

module.exports = function (Mkcms, app, callback) {

    var socket = Mkcms.get('socket');
    var message = Mkcms.get('name') + 'is ready on' + socket;

    fs.unlink(socket, function(){
        Mkcms.httpServer = app.listen(socket, function (err) {
            callback(err,message);
        });
        fs.chmod(socket, 0x777);
    })
}

