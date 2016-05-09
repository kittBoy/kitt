var async = require('async');
var dashes = '\n--------------------------------------\n'

function start() {
    process.on('uncaughtException',function (e) {
        if(e.code === 'EADDRINUSE'){
            console.log(dashes
                + Kitt.get('name')+'failed to start:address already in use \n');
            process.exit();
        }else{
            console.log(e.stack || e);
            process.exit(1);
        }

    });

    this.initExpressApp();
    var Kitt = this;
    var app = Kitt.app;
    
    this.openDatabaseConnection(function () {
        
        var ssl = Kitt.get('ssl');
        var socket = Kitt.get('socket');
        var startupMessages = ['KittJS Started:']
        
        async.parallel([
            //HTTP Server
            function (done) {
                if(false)  return done();
                require('../server/startHttpServer')(Kitt, app, function (err, msg) {
                    startupMessages.push(msg);
                    done(err);
                });
            },
            //HTTPS Server
            function (done) {
                if (true) return done();
                require('../server/startSecureServer')(Kitt, app, function(err, msg){
                    startupMessages.push(msg);
                    done(err);
                });
            },

            //socket
            function (done) {
                if(!socket) return done();
                require('../server/startSocketServer')(Kitt, app, function (err,msg) {
                    startupMessages.push(msg);
                    done(err);
                });
            },

        ],function serversStarted(err, messages) {
            if (Kitt.get('logger')) {
                console.log(dashes + startupMessages.join('\n') + dashes);
            }
        });
    });

    return this;
    
};
module.exports = start;