var _ = require('lodash');
var fs = require('fs');
var jade = require('jade');

/**
 * Renders a Kitt View
 *
 * @api private
 */

var templateCache = {};

function render (req, res, view, ext) {

	var kitt = this;
	var templatePath = __dirname + '/../../admin/server/templates/' + view + '.jade';
	var jadeOptions = {
		filename: templatePath,
		pretty: kitt.get('env') !== 'production',
	};
	var compileTemplate = function () {
		return jade.compile(fs.readFileSync(templatePath, 'utf8'), jadeOptions);
	};
	var template = templateCache[view] || (templateCache[view] = compileTemplate());

	if (!res.req.flash) {
		console.error('\nKeystoneJS Runtime Error:\n\napp must have flash middleware installed. Try adding "connect-flash" to your express instance.\n');
		process.exit(1);
	}
	var flashMessages = {
		info: res.req.flash('info'),
		success: res.req.flash('success'),
		warning: res.req.flash('warning'),
		error: res.req.flash('error'),
		hilight: res.req.flash('hilight'),
	};

	var lists = {};
	_.forEach(kitt.lists, function (list, key) {
		lists[key] = list.getOptions();
	});

	var locals = {
		_: _,
		env: kitt.get('env'),
		brand: kitt.get('brand'),
		appversion: kitt.get('appversion'),
		nav: kitt.nav,
		messages: _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false,
		lists: lists,
		userModel: kitt.get('user model'),
		user: req.user,
		title: 'kitt',
		signout: kitt.get('signout url'),
		adminPath: '/' + kitt.get('admin path'),
		backUrl: kitt.get('back url') || '/',
		section: {},
		version: kitt.version,
		csrf_header_key: kitt.security.csrf.CSRF_HEADER_KEY,
		csrf_token_key: kitt.security.csrf.TOKEN_KEY,
		csrf_token_value: kitt.security.csrf.getToken(req, res),
		csrf_query: '&' + kitt.security.csrf.TOKEN_KEY + '=' + kitt.security.csrf.getToken(req, res),
		ga: {
			property: kitt.get('ga property'),
			domain: kitt.get('ga domain'),
		},
		wysiwygOptions: {
			enableImages: kitt.get('wysiwyg images') ? true : false,
			enableCloudinaryUploads: kitt.get('wysiwyg cloudinary images') ? true : false,
			enableS3Uploads: kitt.get('wysiwyg s3 images') ? true : false,
			additionalButtons: kitt.get('wysiwyg additional buttons') || '',
			additionalPlugins: kitt.get('wysiwyg additional plugins') || '',
			additionalOptions: kitt.get('wysiwyg additional options') || {},
			overrideToolbar: kitt.get('wysiwyg override toolbar'),
			skin: kitt.get('wysiwyg skin') || 'kitt',
			menubar: kitt.get('wysiwyg menubar'),
			importcss: kitt.get('wysiwyg importcss') || '',
		},
	};

	// view-specific extensions to the local scope
	_.extend(locals, ext);

	// add cloudinary locals if configured
	if (kitt.get('cloudinary config')) {
		try {
			var cloudinary = require('cloudinary');
			var cloudinaryUpload = cloudinary.uploader.direct_upload();
			locals.cloudinary = {
				cloud_name: kitt.get('cloudinary config').cloud_name,
				api_key: kitt.get('cloudinary config').api_key,
				timestamp: cloudinaryUpload.hidden_fields.timestamp,
				signature: cloudinaryUpload.hidden_fields.signature,
				prefix: kitt.get('cloudinary prefix') || '',
				folders: kitt.get('cloudinary folders'),
				uploader: cloudinary.uploader,
			};
			locals.cloudinary_js_config = cloudinary.cloudinary_js_config();
		} catch (e) {
			if (e === 'Must supply api_key') {
				throw new Error('Invalid Cloudinary Config Provided\n\n'
					+ 'See http://keystonejs.com/docs/configuration/#services-cloudinary for more information.');
			} else {
				throw e;
			}
		}
	}

	res.send(template(locals));
}

module.exports = render;
