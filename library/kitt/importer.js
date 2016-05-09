var fs = require('fs');
var path = require('path');
var debug = require('debug')('kitt:importer');
function dispatchImporter(rel_dirname){
    function importer(from){
        debug('importing ', from);
        var imported = {};
        var joinPath = function () {
            return '.' + path.sep + path.join.apply(path, arguments);
        };

        var fsPath = joinPath(path.relative(process.cwd(), rel_dirname),from);
        fs.readdirSync(fsPath).forEach(function (name) {
            var info = fs.statSync(path.join(fsPath, name));
            debug('recur');
            if(info.isDirectory()){
                imported[name] = importer(joinPath(from, name));
            }else{
                var ext = path.extname(name);
                var base = path.basename(name,ext);
                if(require.extensions[ext]){
                    imported[base] = require(path.join(rel_dirname, from, name));
                }else{
                    debug('cannot require', ext);
                }
            }
        });
        return imported;
    }
    return importer;
}

module.exports = dispatchImporter;