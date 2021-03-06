'use strict';

var nconf = require('nconf');
var async = require('async');
var validator = require('validator');
var winston = require('winston');

var user = require('../user');
var privileges = require('../privileges');
var categories = require('../categories');
var plugins = require('../plugins');
var meta = require('../meta');

var helpers = {};

helpers.notAllowed = function (req, res, error) {

	plugins.fireHook('filter:helpers.notAllowed', {
		req: req,
		res: res,
		error: error
	}, function (err, data) {
		if (err) {
			return winston.error(err);
		}
		if (req.uid) {
			if (res.locals.isAPI) {
				res.status(403).json({
					path: req.path.replace(/^\/api/, ''),
					loggedIn: !!req.uid,
					error: error,
					title: '[[global:403.title]]'
				});
			} else {
				res.status(403).render('403', {
					path: req.path,
					loggedIn: !!req.uid,
					error: error,
					title: '[[global:403.title]]'
				});
			}
		} else {
			if (res.locals.isAPI) {
				req.session.returnTo = nconf.get('relative_path') + req.url.replace(/^\/api/, '');
				res.status(401).json('not-authorized');
			} else {
				req.session.returnTo = nconf.get('relative_path') + req.url;
				res.redirect(nconf.get('relative_path') + '/login');
			}
		}
	});
};

helpers.redirect = function (res, url) {
	if (res.locals.isAPI) {
		res.status(308).json(url);
	} else {
		res.redirect(nconf.get('relative_path') + encodeURI(url));
	}
};

helpers.buildCategoryBreadcrumbs = function (cid, callback) {
	var breadcrumbs = [];

	async.whilst(function () {
		return parseInt(cid, 10);
	}, function (next) {
		categories.getCategoryFields(cid, ['name', 'slug', 'parentCid', 'disabled'], function (err, data) {
			if (err) {
				return next(err);
			}

			if (!parseInt(data.disabled, 10)) {
				breadcrumbs.unshift({
					text: validator.escape(String(data.name)),
					url: nconf.get('relative_path') + '/category/' + data.slug
				});
			}

			cid = data.parentCid;
			next();
		});
	}, function (err) {
		if (err) {
			return callback(err);
		}

		if (!meta.config.homePageRoute && meta.config.homePageCustom) {
			breadcrumbs.unshift({
				text: '[[global:header.categories]]',
				url: nconf.get('relative_path') + '/categories'
			});
		}

		breadcrumbs.unshift({
			text: '[[global:home]]',
			url: nconf.get('relative_path') + '/'
		});

		callback(null, breadcrumbs);
	});
};


helpers.buildBreadcrumbs = function (crumbs) {
	var breadcrumbs = [
		{
			text: '[[global:home]]',
			url: nconf.get('relative_path') + '/'
		}
	];

	crumbs.forEach(function (crumb) {
		if (crumb) {
			if (crumb.url) {
				crumb.url = nconf.get('relative_path') + crumb.url;
			}
			breadcrumbs.push(crumb);
		}
	});

	return breadcrumbs;
};

helpers.buildTitle = function (pageTitle) {
	var titleLayout = meta.config.titleLayout || '{pageTitle} | {browserTitle}';

	var browserTitle = validator.escape(String(meta.config.browserTitle || meta.config.title || 'NodeBB'));
	pageTitle = pageTitle || '';
	var title = titleLayout.replace('{pageTitle}', function () {
		return pageTitle;
	}).replace('{browserTitle}', function () {
		return browserTitle;
	});
	return title;
};

helpers.setTopicRootCid = function (cid, callback) {
	categories.getCategoryField(cid, 'parentCid', function(err,data){
		if(err){
			callback(null,err)
		}

		if(data != '0' && data){
			helpers.setTopicRootCid(data,callback)
		}else{
			callback(null, cid)
		}
	})
}

helpers.getWatchedCategories = function (uid, selectedCid, callback) {
	async.waterfall([
		function (next) {
			user.getWatchedCategories(uid, next);
		},
		function (cids, next) {
			privileges.categories.filterCids('read', cids, uid, next);
		},
		function (cids, next) {
			categories.getCategoriesFields(cids, ['cid', 'name', 'slug', 'icon', 'link', 'color', 'bgColor', 'parentCid'], next);
		},
		function (categoryData, next) {
			categoryData = categoryData.filter(function (category) {
				return category && !category.link;
			});

			var selectedCategory;
			categoryData.forEach(function (category) {
				category.selected = parseInt(category.cid, 10) === parseInt(selectedCid, 10);
				if (category.selected) {
					selectedCategory = category;
				}
			});

			var categoriesData = [];
			var tree = categories.getTree(categoryData, 0);

			tree.forEach(function (category) {
				recursive(category, categoriesData, '');
			});

			next(null, {categories: categoriesData, selectedCategory: selectedCategory});
		}
	], callback);
};

function recursive(category, categoriesData, level) {
	category.level = level;
	categoriesData.push(category);

	category.children.forEach(function (child) {
		recursive(child, categoriesData, '&nbsp;&nbsp;&nbsp;&nbsp;' + level);
	});
}

module.exports = helpers;
