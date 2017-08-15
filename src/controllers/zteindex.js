"use strict";

var async = require('async');
var nconf = require('nconf');
var validator = require('validator');

var categories = require('../categories');
var privileges = require('../privileges');
var meta = require('../meta');
var helpers = require('./helpers');

var zteindexController = {};

zteindexController.list = function (req, res, next) {
	res.locals.metaTags = [{
		name: "title",
		content: validator.escape(String(meta.config.title || 'NodeBB'))
	}, {
		name: "description",
		content: validator.escape(String(meta.config.description || ''))
	}, {
		property: 'og:title',
		content: '[[pages:categories]]'
	}, {
		property: 'og:type',
		content: 'website'
	}];

	var ogImage = meta.config['og:image'] || meta.config['brand:logo'] || '';
	if (ogImage) {
		if (!ogImage.startsWith('http')) {
			ogImage = nconf.get('url') + ogImage;
		}
		res.locals.metaTags.push({
			property: 'og:image',
			content: ogImage
		});
	}

	var categoryData;
	async.waterfall([
		function (next) {
			//让首页按照板块id=1的权限设置
			privileges.categories.get(1, req.uid, next);
		},
		function (privileges, next) {
			if(!privileges.read){
				return helpers.notAllowed(req, res);
			}
			categories.getCategoriesByPrivilege('cid:0:children', req.uid, 'find', next);
		},
		function (_categoryData, next) {
			categoryData = _categoryData;

			var allCategories = [];
			categories.flattenCategories(allCategories, categoryData);

			categories.getRecentTopicReplies(allCategories, req.uid, next);
		}
	], function (err) {
		if (err) {
			return next(err);
		}

		var data = {
			title: '[[pages:categories]]',
			categories: categoryData
		};

		if (req.path.startsWith('/api/categories') || req.path.startsWith('/categories')) {
			data.breadcrumbs = helpers.buildBreadcrumbs([{text: data.title}]);
		}

		data.categories.forEach(function (category) {
			if (category && Array.isArray(category.posts) && category.posts.length) {
				category.teaser = {
					url: nconf.get('relative_path') + '/topic/' + category.posts[0].topic.slug + '/' + category.posts[0].index,
					timestampISO: category.posts[0].timestampISO,
					pid: category.posts[0].pid
				};
			}
		});

		res.render('index', data);
	});
};

module.exports = zteindexController;
