var debug = require('debug')('kitt:openDatabaseConnection');
var orm = require('orm')
module.exports = function openDatabaseConnection (callback) {

    var kitt = this;
    var dbConnectionOpen = false;

    var opts = {
        host:     this.get('db').host,
        database: this.get('db').database,
        protocol: this.get('db').protocol,
        port:     this.get('db').port,
        query:    {pool: true,debug: true}
    };
     orm.connect('mongodb://localhost/keystone-demo', function(err,db) {
        if (err){
            if (kitt.get('logger')) {
                console.log('------------------------------------------------');
                console.log('DB Error:\n');
                console.log(err);
            }

            if (dbConnectionOpen) {
                if (err.name === 'ValidationError') return;
                throw err;
            } else {
                throw new Error('kittJS (' + kitt.get('name') + ') failed to start - Check that you are running `db` in a separate process.');
            }
        }else{
            debug('db connection open');
            dbConnectionOpen = true;
            kitt.dbCtl=db;
            kitt.get('models')();
            kitt.models=db.models;
            var connected = function () {

                    callback();
            }


            if (kitt.sessionStorePromise) {
                kitt.sessionStorePromise.then(connected);
            } else {
                connected();
            }
        }

    });




    return this;
};
