
'use strict';

var async = require('async');

var db = require('./database');

(function (Project) {

	require('./project/create')(Project);
	require('./project/delete')(Project);

	Project.exists = function (proid, callback) {
		db.isSortedSetMember('project:proid', proid, callback);
	};

	Project.getCategoryFields = function (proid, fields, callback) {
		db.getObjectFields('project:' + proid, fields, callback);
	};

	Project.getProjectData = function (proid, callback) {
		db.getObject('project:' + proid, function (err, project) {
			if (err) {
				return callback(err);
			}

			callback(null, project);
		});
	};

	Project.getProjectsData = function (proids, callback) {
		if (!Array.isArray(proids) || !proids.length) {
			return callback(null, []);
		}
		var keys = proids.map(function (proid) {
			return 'project:' + proid;
		});

		db.getObjects(keys, function (err, projects) {
			if (err || !Array.isArray(projects) || !projects.length) {
				return callback(err, []);
			}

			callback(null, projects);
		});
	};

}(exports));
