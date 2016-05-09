var kitt = require('../../../')
function Model(key){
    
    if (key === undefined) return kitt.dbCtl;
    return kitt.dbCtl.models[key];
}


module.exports = Model;