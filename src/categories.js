
'use strict';

var async = require('async');

var db = require('./database');
var user = require('./user');
var Groups = require('./groups');
var plugins = require('./plugins');
var privileges = require('./privileges');

(function (Categories) {

	require('./categories/data')(Categories);
	require('./categories/create')(Categories);
	require('./categories/delete')(Categories);
	require('./categories/topics')(Categories);
	require('./categories/unread')(Categories);
	require('./categories/activeusers')(Categories);
	require('./categories/recentreplies')(Categories);
	require('./categories/update')(Categories);

	Categories.exists = function (cid, callback) {
		db.isSortedSetMember('categories:cid', cid, callback);
	};

	Categories.getCategoryById = function (data, callback) {
		var category;
		async.waterfall([
			function (next) {
				Categories.getCategories([data.cid], data.uid, next);
			},
			function (categories, next) {
				if (!Array.isArray(categories) || !categories[0]) {
					return next(new Error('[[error:invalid-cid]]'));
				}
				category = categories[0];

				async.parallel({
					topics: function (next) {
						Categories.getCategoryTopics(data, next);
					},
					topicCount: function (next) {
						if (Array.isArray(data.set)) {
							db.sortedSetIntersectCard(data.set, next);
						} else {
							next(null, category.topic_count);
						}
					},
					isIgnored: function (next) {
						Categories.isIgnored([data.cid], data.uid, next);
					}
				}, next);
			},
			function (results, next) {
				category.topics = results.topics.topics;
				category.nextStart = results.topics.nextStart;
				category.isIgnored = results.isIgnored[0];
				category.topic_count = results.topicCount;

				plugins.fireHook('filter:category.get', {category: category, uid: data.uid}, next);
			},
			function (data, next) {
				next(null, data.category);
			}
		], callback);
	};

	Categories.isIgnored = function (cids, uid, callback) {
		db.isSortedSetMembers('uid:' + uid + ':ignored:cids', cids, callback);
	};

	Categories.getPageCount = function (cid, uid, callback) {
		async.parallel({
			topicCount: async.apply(Categories.getCategoryField, cid, 'topic_count'),
			settings: async.apply(user.getSettings, uid)
		}, function (err, results) {
			if (err) {
				return callback(err);
			}

			if (!parseInt(results.topicCount, 10)) {
				return callback(null, 1);
			}

			callback(null, Math.ceil(parseInt(results.topicCount, 10) / results.settings.topicsPerPage));
		});
	};

	Categories.getAllCategories = function (uid, callback) {
		db.getSortedSetRange('categories:cid', 0, -1, function (err, cids) {
			if (err || !Array.isArray(cids) || !cids.length) {
				return callback(err, []);
			}

			Categories.getCategories(cids, uid, callback);
		});
	};

	Categories.getCategoriesByPrivilege = function (set, uid, privilege, callback) {
		async.waterfall([
			function (next) {
				db.getSortedSetRange(set, 0, -1, next);
			},
			function (cids, next) {
				privileges.categories.filterCids(privilege, cids, uid, next);
			},
			function (cids, next) {
				Categories.getCategories(cids, uid, next);
			}
		], callback);
	};

	Categories.getChildrenAndCategoriesAndByPrivilege = function (cids, uid, privilege, callback) {
		async.waterfall([
			function (next) {
				privileges.categories.filterCids(privilege, cids, uid, next);
			},
			function (cids, next) {
				if(cids.length == 0){
					cids = [0];
				}
				Categories.getChildren(cids, uid, next);
			}
		], callback);
	};

	Categories.getModerators = function (cid, callback) {
		Groups.getMembers('cid:' + cid + ':privileges:mods', 0, -1, function (err, uids) {
			if (err || !Array.isArray(uids) || !uids.length) {
				return callback(err, []);
			}

			user.getUsersFields(uids, ['uid', 'username', 'userslug', 'picture'], callback);
		});
	};


	Categories.getCategories = function (cids, uid, callback) {
		if (!Array.isArray(cids)) {
			return callback(new Error('[[error:invalid-cid]]'));
		}

		if (!cids.length) {
			return callback(null, []);
		}

		async.parallel({
			categories: function (next) {
				Categories.getCategoriesData(cids, next);
			},
			children: function (next) {
				Categories.getChildren(cids, uid, next);
			},
			parents: function (next) {
				Categories.getParents(cids, next);
			},
			tagWhitelist: function (next) {
				Categories.getTagWhitelist(cids, next);
			},
			hasRead: function (next) {
				Categories.hasReadCategories(cids, uid, next);
			}
		}, function (err, results) {
			if (err) {
				return callback(err);
			}

			uid = parseInt(uid, 10);
			results.categories.forEach(function (category, i) {
				if (category) {
					category['unread-class'] = (parseInt(category.topic_count, 10) === 0 || (results.hasRead[i] && uid !== 0)) ? '' : 'unread';
					category.children = results.children[i];
					category.parent = results.parents[i] || undefined;
					category.tagWhitelist = results.tagWhitelist[i];
					calculateTopicPostCount(category);
				}
			});

			callback(null, results.categories);
		});
	};

	Categories.getTagWhitelist = function (cids, callback) {
		var keys = cids.map(function (cid) {
			return 'cid:' + cid + ':tag:whitelist';
		});
		db.getSortedSetsMembers(keys, callback);
	};

	function calculateTopicPostCount(category) {
		if (!category) {
			return;
		}

		var postCount = parseInt(category.post_count, 10) || 0;
		var topicCount = parseInt(category.topic_count, 10) || 0;
		if (!Array.isArray(category.children) || !category.children.length) {
			category.totalPostCount = postCount;
			category.totalTopicCount = topicCount;
			return;
		}

		category.children.forEach(function (child) {
			calculateTopicPostCount(child);
			postCount += parseInt(child.totalPostCount, 10) || 0;
			topicCount += parseInt(child.totalTopicCount, 10) || 0;
		});

		category.totalPostCount = postCount;
		category.totalTopicCount = topicCount;
	}

	Categories.getParents = function (cids, callback) {
		var categoriesData;
		var parentCids;
		async.waterfall([
			function (next) {
				Categories.getCategoriesFields(cids, ['parentCid'], next);
			},
			function (_categoriesData, next) {
				categoriesData = _categoriesData;

				parentCids = categoriesData.filter(function (category) {
					return category && category.hasOwnProperty('parentCid') && parseInt(category.parentCid, 10);
				}).map(function (category) {
					return parseInt(category.parentCid, 10);
				});

				if (!parentCids.length) {
					return callback(null, cids.map(function () {return null;}));
				}

				Categories.getCategoriesData(parentCids, next);
			},
			function (parentData, next) {
				parentData = categoriesData.map(function (category) {
					return parentData[parentCids.indexOf(parseInt(category.parentCid, 10))];
				});
				next(null, parentData);
			}
		], callback);
	};

	Categories.getChildren = function (cids, uid, callback) {
		var categories = cids.map(function (cid) {
			return {cid: cid};
		});

		async.each(categories, function (category, next) {
			getChildrenRecursive(category, uid, next);
		}, function (err) {
			callback(err, categories.map(function (c) {
				return c && c.children;
			}));
		});
	};

	function getChildrenRecursive(category, uid, callback) {
		async.waterfall([
			function (next) {
				db.getSortedSetRange('cid:' + category.cid + ':children', 0, -1, next);
			},
			function (children, next) {
				privileges.categories.filterCids('find', children, uid, next);
			},
			function (children, next) {
				children = children.filter(function (cid) {
					return parseInt(category.cid, 10) !== parseInt(cid, 10);
				});
				if (!children.length) {
					category.children = [];
					return callback();
				}
				Categories.getCategoriesData(children, next);
			},
			function (childrenData, next) {
				childrenData = childrenData.filter(Boolean);
				category.children = childrenData;
				async.each(category.children, function (child, next) {
					getChildrenRecursive(child, uid, next);
				}, next);
			}
		], callback);
	}

	Categories.flattenCategories = function (allCategories, categoryData) {
		categoryData.forEach(function (category) {
			if (!category) {
				return;
			}

			if (!category.parent) {
				allCategories.push(category);
			}

			if (Array.isArray(category.children) && category.children.length) {
				Categories.flattenCategories(allCategories, category.children);
			}
		});
	};

	/**
	 * Recursively build tree
	 *
	 * @param categories {array} flat list of categories
	 * @param parentCid {number} start from 0 to build full tree
	 */
	Categories.getTree = function (categories, parentCid) {
		var tree = [], i = 0, len = categories.length, category;

		for (i; i < len; ++i) {
			category = categories[i];
			if (!category.hasOwnProperty('parentCid') || category.parentCid === null) {
				category.parentCid = 0;
			}

			if (parseInt(category.parentCid, 10) === parseInt(parentCid, 10)) {
				tree.push(category);
				category.children = Categories.getTree(categories, category.cid);
			}
		}

		return tree;
	};

	Categories.buildForSelect = function (uid, callback) {
		function recursive(category, categoriesData, level) {
			if (category.link) {
				return;
			}

			var bullet = level ? '&bull; ' : '';
			category.value = category.cid;
			category.text = level + bullet + category.name;
			categoriesData.push(category);

			category.children.forEach(function (child) {
				recursive(child, categoriesData, '&nbsp;&nbsp;&nbsp;&nbsp;' + level);
			});
		}
		Categories.getCategoriesByPrivilege('cid:0:children', uid, 'read', function (err, categories) {
			if (err) {
				return callback(err);
			}

			var categoriesData = [];

			categories = categories.filter(function (category) {
				return category && !category.link && !parseInt(category.parentCid, 10);
			});

			categories.forEach(function (category) {
				recursive(category, categoriesData, '');
			});
			callback(null, categoriesData);
		});
	};

	Categories.getIgnorers = function (cid, start, stop, callback) {
		db.getSortedSetRevRange('cid:' + cid + ':ignorers', start, stop, callback);
	};

	Categories.filterIgnoringUids = function (cid, uids, callback) {
		async.waterfall([
			function (next) {
				db.sortedSetScores('cid:' + cid + ':ignorers', uids, next);
			},
			function (scores, next) {
				var readingUids = uids.filter(function (uid, index) {
					return uid && !!scores[index];
				});
				next(null, readingUids);
			}
		], callback);
	};


}(exports));
