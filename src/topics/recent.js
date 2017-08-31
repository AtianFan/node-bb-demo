

'use strict';

var async = require('async');
var db = require('../database');
var plugins = require('../plugins');
var privileges = require('../privileges');
var user = require('../user');
var categories =  require('../categories');

module.exports = function (Topics) {
	var terms = {
		day: 86400000,
		week: 604800000,
		month: 2592000000,
		year: 31104000000
	};

	Topics.getRecentTopics = function (cid, uid, start, stop, filter, callback) {
		var recentTopics = {
			nextStart : 0,
			topics: []
		};

		async.waterfall([
			function (next) {
				if (cid) {
					categories.getTopicIds(cid, 'cid:' + cid + ':tids', true, 0, 199, next);
				} else {
					db.getSortedSetRevRange('topics:recent', 0, 199, next);
				}
			},
			function (tids, next) {
				filterTids(tids, uid, filter, next);
			},
			function (tids, next) {
				recentTopics.topicCount = tids.length;
				tids = tids.slice(start, stop + 1);
				Topics.getTopicsByTids(tids, uid, next);
			},
			function (topicData, next) {
				recentTopics.topics = topicData;
				recentTopics.nextStart = stop + 1;
				next(null, recentTopics);
			}
		], callback);
	};

	Topics.getRecentTopicsByRootcid = function (cid, uid, start, stop, filter, rootCid, callback) {
		var recentTopics = {
			nextStart : 0,
			topics: []
		};

		async.waterfall([
			function (next) {
				if (cid) {
					categories.getTopicIds(cid, 'cid:' + cid + ':tids', true, 0, 199, next);
				} else {
					db.getSortedSetRevRange('topics:recent', 0, 2000, next);
				}
			},
			function (tids, next) {
				filterTidsByRootcid(tids, uid, filter, rootCid, next);
				console.log(tids.length);
				console.log(rootCid);
			},
			function (tids, next) {
				recentTopics.topicCount = tids.length;
				console.log(tids.length);
				tids = tids.slice(start, stop + 1);
				Topics.getTopicsByTids(tids, uid, next);
			},
			function (topicData, next) {
				recentTopics.topics = topicData;
				console.log(topicData);
				recentTopics.nextStart = stop + 1;
				next(null, recentTopics);
			}
		], callback);
	};


	function filterTids(tids, uid, filter, callback) {
		async.waterfall([
			function (next) {
				if (filter === 'watched') {
					Topics.filterWatchedTids(tids, uid, next);
				} else if (filter === 'new') {
					Topics.filterNewTids(tids, uid, next);
				} else {
					Topics.filterNotIgnoredTids(tids, uid, next);
				}
			},
			function (tids, next) {
				privileges.topics.filterTids('read', tids, uid, next);
			},
			function (tids, next) {
				async.parallel({
					ignoredCids: function (next) {
						if (filter === 'watched') {
							return next(null, []);
						}
						user.getIgnoredCategories(uid, next);
					},
					topicData: function (next) {
						Topics.getTopicsFields(tids, ['tid', 'cid'], next);
					}
				}, next);
			},
			function (results, next) {
				tids = results.topicData.filter(function (topic) {
					if (topic) {
						return results.ignoredCids.indexOf(topic.cid.toString()) === -1;
					} else {
						return false;
					}
				}).map(function (topic) {
					return topic.tid;
				});
				next(null, tids);
			}
		], callback);
	}

	function filterTidsByRootcid(tids, uid, filter, rootCid, callback) {
		async.waterfall([
			function (next) {
				if (filter === 'watched') {
					Topics.filterWatchedTids(tids, uid, next);
				} else if (filter === 'new') {
					Topics.filterNewTids(tids, uid, next);
				} else {
					Topics.filterNotIgnoredTids(tids, uid, next);
				}
			},
			function (tids, next) {
				privileges.topics.filterTids('read', tids, uid, next);
			},
			function (tids, next) {
				async.parallel({
					ignoredCids: function (next) {
						if (filter === 'watched') {
							return next(null, []);
						}
						user.getIgnoredCategories(uid, next);
					},
					topicData: function (next) {
						Topics.getTopicsFields(tids, ['tid', 'cid', 'rootCid'], next);
					}
				}, next);
			},
			function (results, next) {
				console.log('----------');
				console.log(results.topicData.length);
				console.log('----------');
				tids = results.topicData.filter(function (topic) {
					if (topic) {
						return results.ignoredCids.indexOf(topic.cid.toString()) === -1;
					} else {
						return false;
					}
				}).filter(function (topic) {
					if(topic && topic.rootCid){
						return topic.rootCid == rootCid;
					}
				}).map(function (topic) {
					return topic.tid;
				});

				next(null, tids);
			}
		], callback);
	}

	Topics.getLatestTopics = function (uid, start, stop, term, callback) {
		async.waterfall([
			function (next) {
				Topics.getLatestTidsFromSet('topics:recent', start, stop, term, next);
			},
			function (tids, next) {
				Topics.getTopics(tids, uid, next);
			},
			function (topics, next) {
				next(null, {topics: topics, nextStart: stop + 1});
			}
		], callback);
	};

	Topics.getLatestTidsFromSet = function (set, start, stop, term, callback) {
		var since = terms.day;
		if (terms[term]) {
			since = terms[term];
		}

		var count = parseInt(stop, 10) === -1 ? stop : stop - start + 1;

		db.getSortedSetRevRangeByScore(set, start, count, '+inf', Date.now() - since, callback);
	};

	Topics.updateTimestamp = function (tid, timestamp, callback) {
		async.parallel([
			function (next) {
				async.waterfall([
					function (next) {
						Topics.getTopicField(tid, 'deleted', next);
					},
					function (deleted, next) {
						if (parseInt(deleted, 10) === 1) {
							return next();
						}
						Topics.updateRecent(tid, timestamp, next);
					}
				], next);
			},
			function (next) {
				Topics.setTopicField(tid, 'lastposttime', timestamp, next);
			}
		], function (err) {
			callback(err);
		});
	};

	Topics.updateRecent = function (tid, timestamp, callback) {
		callback = callback || function () {};
		if (plugins.hasListeners('filter:topics.updateRecent')) {
			plugins.fireHook('filter:topics.updateRecent', {tid: tid, timestamp: timestamp}, function (err, data) {
				if (err) {
					return callback(err);
				}
				if (data && data.tid && data.timestamp) {
					db.sortedSetAdd('topics:recent', data.timestamp, data.tid, callback);
				} else {
					callback();
				}
			});
		} else {
			db.sortedSetAdd('topics:recent', timestamp, tid, callback);
		}
	};
};
