var options = exports.options = function options(defaults, ops) {
    defaults = defaults || {};
    ops = ops || {};
    Object.keys(ops).forEach(function (key) {
        defaults[key] = ops[key];
    });
    return defaults;
}
/**
 * Converts a key to a property. Like keyToPath but converts
 * to headlessCamelCase instead of dash-separated
 *
 * @param {String} key
 * @return {String}
 * @api public
 */

var keyToProperty = exports.keyToProperty = function keyToProperty (str, plural) {
	if (str && str.toString) str = str.toString();
	if (!isString(str) || !str.length) return '';
	var parts = slug(keyToLabel(str)).split('-');
	if (parts.length && plural) {
		parts[parts.length - 1] = inflect.pluralize(parts[parts.length - 1]);
	}
	for (var i = 1; i < parts.length; i++) {
		parts[i] = upcase(parts[i]);
	}
	return parts.join('');
};
/**
 * Recursively binds method properties of an object to a scope
 * and returns a new object containing the bound methods
 *
 * @param {Object} object with method properties, can be nested in other objects
 * @param {Object} scope to bind as `this`
 * @return {Object} a new object containing the bound methods
 * @api public
 */

var bindMethods = exports.bindMethods = function bindMethods (obj, scope) {
	var bound = {};
	for (var prop in obj) {
		if (typeof obj[prop] === 'function') {
			bound[prop] = obj[prop].bind(scope);
		} else if (isObject(obj[prop])) {
			bound[prop] = bindMethods(obj[prop], scope);
		}
	}
	return bound;
};
/**
 * Determines if `arg` is an object.
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @return {Boolean}
 * @api public
 */

var isObject = exports.isObject = function isObject (arg) {
	return Object.prototype.toString.call(arg) === '[object Object]';
};

/**
 * Generates a 'random' string of characters to the specified length.
 *
 * @param {Number or Array}   len      the length of string to generate, can be a range (Array), Defaults to 10.
 * @param {String}            chars    characters to include in the string, defaults to `0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz`
 * @return {String}
 * @api public
 */

var randomString = exports.randomString = require('randomkey');
/**
 * Converts a key to a path. Like slug(keyToLabel(str)) but
 * optionally converts the last word to a plural.
 *
 * @param {String} key
 * @return {String}
 * @api public
 */
var _slug = require('slug');
var slug = exports.slug = function slug (str, sep, options) {
    if (!limax) {
        return _slug(str,sep).toLowerCase();
    }
    options = options || {};
    sep = sep || '-';
    return limax(str, { tone: false, lang: options.locale, separator: sep });
};
var inflect = require('i')();
var keyToPath = exports.keyToPath = function keyToPath (str, plural) {
    if (str && str.toString) str = str.toString();
    if (!isString(str) || !str.length) return '';
    var parts = slug(keyToLabel(str)).split('-');
    if (parts.length && plural) {
        parts[parts.length - 1] = inflect.pluralize(parts[parts.length - 1]);
    }
    return parts.join('-');
};
/**
 * Converts a key to a label.
 *
 * @param {String} key
 * @return {String}
 * @api public
 */

var keyToLabel = exports.keyToLabel = function keyToLabel (str) {
    if (str && str.toString) str = str.toString();
    if (!isString(str) || !str.length) return '';
    str = str.replace(/([a-z])([A-Z])/g, '$1 $2');
    str = str.replace(/([0-9])([a-zA-Z])/g, '$1 $2');
    str = str.replace(/([a-zA-Z])([0-9])/g, '$1 $2');
    var parts = str.split(/\s|\.|_|-|:|;|([A-z\u00C0-\u00ff]+)/);
    for (var i = 0; i < parts.length; i++) {
        if (parts[i] && !/^[A-Z0-9]+$/.test(parts[i])) {
            parts[i] = upcase(parts[i]);
        }
    }
    return compact(parts).join(' ');
};
/**
 * Converts the first letter in a string to uppercase
 *
 * @param {String} str
 * @return {String} Str
 * @api public
 */

var upcase = exports.upcase = function upcase (str) {
    if (str && str.toString) str = str.toString();
    if (!isString(str) || !str.length) return '';
    return (str.substr(0, 1).toUpperCase() + str.substr(1));
};
function compact(arr) {
    return arr.filter(function(v) {
        return !!v;
    });
}
var limax;
try {
    limax = require('limax');
} catch(e) {}
/**
 * Displays the singular or plural of a string based on a number
 * or number of items in an array.
 *
 * If arity is 1, returns the plural form of the word.
 *
 * @param {String} count
 * @param {String} singular string
 * @param {String} plural string
 * @return {String} singular or plural, * is replaced with count
 * @api public
 */

var plural = exports.plural = function plural (count, sn, pl) {
    if (arguments.length === 1) {
        return inflect.pluralize(count);
    }
    if (typeof sn !== 'string') sn = '';
    if (!pl) {
        pl = inflect.pluralize(sn);
    }
    if (typeof count === 'string') {
        count = Number(count);
    } else if (typeof count !== 'number') {
        count = Object.keys(count).length;
    }
    return (count === 1 ? sn : pl).replace('*', count);
};
/**
 * Converts a string to its singular form
 *
 * @param {String} str
 * @return {String} singular form of str
 * @api public
 */

var singular = exports.singular = function singular (str) {
    return inflect.singularize(str);
};

/**
 * Determines if `arg` is a string.
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @return {Boolean}
 * @api public
 */

var isString = exports.isString = function isString (arg) {
    return typeof arg === 'string';
};
