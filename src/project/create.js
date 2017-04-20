'use strict';

var async = require('async');

var db = require('../database');
var groups = require('../groups');
var plugins = require('../plugins');
var privileges = require('../privileges');
var utils = require('../../public/src/utils');

module.exports = function (Project) {

	Project.create = function (data, callback) {
		var project;
		var parentCid = data.parentCid ? data.parentCid : 0;

		async.waterfall([
			function (next) {
				db.getObjectField('global', 'nextCid', next);
			},
			function (proid, next) {
				data.name = data.name || 'Project ' + proid;
				var slug = proid + '/' + utils.slugify(data.name);
				var order = data.order || proid;	// If no order provided, place it at the end
				// var colours = Categories.assignColours();

				project = {
					proid: proid,
					name: data.name,
					description: data.description ? data.description : '',
					slug: slug,
					parentCid: parentCid,
					codePublishCount: Math.floor(Math.random()),
					tpl: data.tpl
				};

				plugins.fireHook('filter:project.create', {project: project, data: data}, next);
			},
			function (data, next) {
				project = data.project;

				async.series([
					async.apply(db.setObject, 'project:' + project.procid, project)
					// async.apply(db.sortedSetAdd, 'proid:' + parentCid + ':children', project.order, project.cid),
				], next);
			},
			function (results, next) {
				// if (data.cloneFromCid && parseInt(data.cloneFromCid, 10)) {
				// 	return Categories.copySettingsFrom(data.cloneFromCid, category.cid, !data.parentCid, next);
				// }
				next(null, project);
			},
			function (category, next) {
				plugins.fireHook('action:project.create', project);
				next(null, project);
			}
		], callback);
	};
};
