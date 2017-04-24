'use strict';

var async = require('async');

var db = require('../database');
var groups = require('../groups');
var plugins = require('../plugins');
var privileges = require('../privileges');
var utils = require('../../public/src/utils');

module.exports = function (Project) {

	Project.create = function (category, callback) {
		var project;
		var parentCid = category.parentCid ? category.parentCid : 0;

		async.waterfall([
			function (next) {
				db.getObjectField('global', 'nextCid', next);
			},
			function (proid, next) {
				category.name = category.name || 'Project ' + proid;
				var slug = proid + '/' + utils.slugify(category.name);
				var order = category.order || proid;	// If no order provided, place it at the end
				// var colours = Categories.assignColours();

				project = {
					proid: proid,
					name: category.name,
					description: category.description ? category.description : '',
					slug: slug,
					parentCid: parentCid,
					codePublishCount: Math.floor(Math.random()*100),
					tpl: category.tpl
				};

				plugins.fireHook('filter:project.create', project, next);
			},
			function (project, next) {

				async.series([
					async.apply(db.setObject, 'project:' + project.proid, project)
					// async.apply(db.sortedSetAdd, 'proid:' + parentCid + ':children', project.order, project.cid),
				], next);
			},
			function (results, next) {
				// if (data.cloneFromCid && parseInt(data.cloneFromCid, 10)) {
				// 	return Categories.copySettingsFrom(data.cloneFromCid, category.cid, !data.parentCid, next);
				// }
				next(null, project);
			},
			function (project, next) {
				plugins.fireHook('action:project.create', project);
				next(null, {project: project, category: category, cid: category.cid});
			}
		], callback);
	};
};
