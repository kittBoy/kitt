var path = require('path');

module.exports = function initViewEngine (Kitt, app) {

    if(Kitt.get('custom engine')){
        app.engine(Kitt.get('view engine'),Kitt.get('custom engine'));
    }

    app.set('views', Kitt.getPath('views') || path.sep + 'views');
    app.set('view engine', Kitt.get('view engine'));

    var customView =Kitt.get('view');
    if(customView){
        app.set('view', customView);
    }
}