var callerId = require('caller-id');
var path = require('path');
var url = require('url');

/**
 * Kitt's options 处理方法
 * 所有kitt方法会附加到 Kitt.prototype
 */

// 检测是否为绝对路径
function isAbsolutePath(value) {
    return path.resolve(value) === path.normalize(value).replace(new RegExp(path.sep + '$'), '');
}

/**
 * 设置kitt's options
 *
 * 例如:
 *     kitt.set('user  model', 'User')
 */
exports.set = function (key, value) {

    if (arguments.length === 1) {
        return this._options[key];
    }

    switch (key) {

        // 特殊选项

        case 'module root':

            if (!isAbsolutePath(value)) {
                var caller = callerId.getData();
                value = path.resolve(path.dirname(caller.filePath), value);
            }
            break;
        case 'app':
            this.app = value;
            break;


    }

    this._options[key] = value;
    return this;
};


/**
 *
 * 例子:
 *     kitt.options({test: value}) // sets the 'test' option to `value`
 */
exports.options = function (options) {
    if (!arguments.length) {
        return this._options;
    }
    if (typeof options === 'object') {
        var keys = Object.keys(options);
        var i = keys.length;
        var k;
        while (i--) {
            k = keys[i];
            this.set(k, options[k]);
        }
    }
    return this._options;
};


/**
 * 获取选项
 *
 * 例如:
 *     kitt.get('test') // returns the 'test' value
 */
exports.get = exports.set;

/**
 * 获取绝对路径
 *
 * Example:
 *     kitt.get('pathOption', 'defaultValue')
 */
exports.getPath = function (key, defaultValue) {
    return this.expandPath(this.get(key) || defaultValue);
};

/**
 * 绝对路径
 */
exports.expandPath = function (pathValue) {
    pathValue = (typeof pathValue === 'string' && pathValue.substr(0, 1) !== path.sep && pathValue.substr(1, 2) !== ':\\')
        ? path.join(this.get('module root'), pathValue)
        : pathValue;
    return pathValue;
};
