var _ = require('lodash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var debug = require('debug')('kitt:initExpressSession');

module.exports = function initExpressSession () {

    if (this.expressSession) return this;

    var sessionStorePromise;

    // 初始化以及验证
    if (!this.get('cookie secret')) {
        console.error('\nKittJS Configuration Error:\n\n请设置 `cookie secret` .\n');
        process.exit(1);
    }
    var sessionOptions = this.get('session options');

    if (typeof sessionOptions !== 'object') {
        sessionOptions = {};
    }
    if (!sessionOptions.key) {
        sessionOptions.key = 'this.sid';
    }
    if (!sessionOptions.resave) {
        sessionOptions.resave = false;
    }
    if (!sessionOptions.saveUninitialized) {
        sessionOptions.saveUninitialized = false;
    }
    if (!sessionOptions.secret) {
        sessionOptions.secret = this.get('cookie secret');
    }

    sessionOptions.cookieParser = cookieParser(this.get('cookie secret'));

    var sessionStore = this.get('session store');

    if (typeof sessionStore === 'function') {
        sessionOptions.store = sessionStore(session);
    } else if (sessionStore) {

        var sessionStoreOptions = this.get('session store options') || {};

        // Perform any session store specific configuration or exit on an unsupported session store

        if (sessionStore === 'mongo') {
            sessionStore = 'connect-mongo';
        } else if (sessionStore === 'redis') {
            sessionStore = 'connect-redis';
        }

        switch (sessionStore) {
            case 'connect-mongo':
                debug('using connect-mongo session store');
                _.defaults(sessionStoreOptions, {
                    collection: 'app_sessions',
                    url: this.get('mongo'),
                });
                break;

            case 'connect-mongostore':
                debug('using connect-mongostore session store');
                _.defaults(sessionStoreOptions, {
                    collection: 'app_sessions',
                });
                if (!sessionStoreOptions.db) {
                    console.error(
                        '\nERROR: connect-mongostore requires `session store options` to be set.'
                        + '\n'
                        + '\nSee http://thisjs.com/docs/configuration#options-database for details.'
                        + '\n');
                    process.exit(1);
                }
                break;

            case 'connect-redis':
                debug('using connect-redis session store');
                break;

            default:
                console.error(
                    '\nERROR: unsupported session store ' + sessionStore + '.'
                    + '\n'
                    + '\nSee http://thisjs.com/docs/configuration#options-database for details.'
                    + '\n');
                process.exit(1);
                break;
        }

        // 初始化session store 存储
        try {
            var SessionStore = require(sessionStore)(session);

            sessionStorePromise = new Promise(
                function (resolve, reject) {
                    sessionOptions.store = new SessionStore(sessionStoreOptions, resolve);
                    sessionOptions.store.on('connect', resolve);
                    sessionOptions.store.on('connected', resolve);
                    sessionOptions.store.on('disconnect', function () {
                        console.error(
                            '\nThere was an error connecting to the ' + sessionStore + ' session store.'
                            + '\n');
                        process.exit(1);
                    });
                }
            );
        } catch (e) {
            if (e.code === 'MODULE_NOT_FOUND') {
                console.error(
                    '\n' + e.toString()
                    + '\nTo use ' + this.get('session store') + ' as a `session store` option, run:'
                    + '\nnpm install ' + sessionStore + ' --save'
                    + '\n');
                process.exit(1);
            } else {
                throw e;
            }
        }
    }

    // 初始化session
    this.set('session options', sessionOptions);
    this.expressSession = session(sessionOptions);
    this.sessionStorePromise = sessionStorePromise;

    return this;
};
