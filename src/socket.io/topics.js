
'use strict';

var async = require('async');

var topics = require('../topics');
var websockets = require('./index');
var user = require('../user');
var apiController = require('../controllers/api');
var socketHelpers = require('./helpers');
var categories = require('../categories');
var privileges = require('../privileges');
var fs = require('fs');

var SocketTopics = {};

require('./topics/unread')(SocketTopics);
require('./topics/move')(SocketTopics);
require('./topics/tools')(SocketTopics);
require('./topics/infinitescroll')(SocketTopics);
require('./topics/tags')(SocketTopics);

SocketTopics.post = function (socket, data, callback) {
	if (!data) {
		return callback(new Error('[[error:invalid-data]]'));
	}

	if(data.isAnonymous){
		data.uid = 0;
	}else{
		data.uid = socket.uid;
	}
	
	data.req = websockets.reqFromSocket(socket);
	data.timestamp = Date.now();

	topics.post(data, function (err, result) {
		if (err) {
			return callback(err);
		}

		callback(null, result.topicData);

		socket.emit('event:new_post', {posts: [result.postData]});
		socket.emit('event:new_topic', result.topicData);

		socketHelpers.notifyNew(socket.uid, 'newTopic', {posts: [result.postData], topic: result.topicData});
	});
};

SocketTopics.readjson = function (socket, callback) {
	var topics = JSON.parse(fs.readFileSync('topics.json'));
	var pics = JSON.parse(fs.readFileSync('pic.json'));
	var data = {
		topics: topics,
		pics: pics
	}
	callback(null, data);
}

SocketTopics.batchpost = function (socket, dataArr, callback) {
	if (!dataArr) {
		return callback(new Error('[[error:invalid-data]]'));
	}

	var i = 0;

	async.whilst(function () {
		return i < dataArr.length;
	}, function (next1) {
		dataArr[i].uid = socket.uid;
		dataArr[i].req = websockets.reqFromSocket(socket);
		dataArr[i].timestamp = Date.now();

		topics.post(dataArr[i], function (err, result) {
			if (err) {
				return callback(err);
			}

			socket.emit('event:new_post', {posts: [result.postData]});
			socket.emit('event:new_topic', result.topicData);

			socketHelpers.notifyNew(socket.uid, 'newTopic', {posts: [result.postData], topic: result.topicData});
			i++;
			next1()
		});
	}, function (err) {
		callback(null, {});
	});
}

SocketTopics.postcount = function (socket, tid, callback) {
	topics.getTopicField(tid, 'postcount', callback);
};

SocketTopics.bookmark = function (socket, data, callback) {
	if (!socket.uid || !data) {
		return callback(new Error('[[error:invalid-data]]'));
	}
	topics.setUserBookmark(data.tid, socket.uid, data.index, callback);
};

SocketTopics.createTopicFromPosts = function (socket, data, callback) {
	if (!socket.uid) {
		return callback(new Error('[[error:not-logged-in]]'));
	}

	if (!data || !data.title || !data.pids || !Array.isArray(data.pids)) {
		return callback(new Error('[[error:invalid-data]]'));
	}

	topics.createTopicFromPosts(socket.uid, data.title, data.pids, data.fromTid, callback);
};

SocketTopics.changeWatching = function (socket, data, callback) {
	if (!data.tid || !data.type) {
		return callback(new Error('[[error:invalid-data]]'));
	}
	var commands = ['follow', 'unfollow', 'ignore'];
	if (commands.indexOf(data.type) === -1) {
		return callback(new Error('[[error:invalid-command]]'));
	}
	followCommand(topics[data.type], socket, data.tid, callback);
};

SocketTopics.follow = function (socket, tid, callback) {
	followCommand(topics.follow, socket, tid, callback);
};

function followCommand(method, socket, tid, callback) {
	if (!socket.uid) {
		return callback(new Error('[[error:not-logged-in]]'));
	}

	method(tid, socket.uid, callback);
}

SocketTopics.isFollowed = function (socket, tid, callback) {
	topics.isFollowing([tid], socket.uid, function (err, isFollowing) {
		callback(err, Array.isArray(isFollowing) && isFollowing.length ? isFollowing[0] : false);
	});
};

SocketTopics.search = function (socket, data, callback) {
	topics.search(data.tid, data.term, callback);
};

SocketTopics.isModerator = function (socket, tid, callback) {
	topics.getTopicField(tid, 'cid', function (err, cid) {
		if (err) {
			return callback(err);
		}
		user.isModerator(socket.uid, cid, callback);
	});
};

SocketTopics.getTopic = function (socket, tid, callback) {
	apiController.getTopicData(tid, socket.uid, callback);
};

SocketTopics.loadMore = function (socket, data, callback) {
	if (!data) {
		return callback(new Error('[[error:invalid-data]]'));
	}
	async.parallel({
		privileges: function (next) {
			privileges.categories.get(data.cid, socket.uid, next);
		},
		settings: function (next) {
			user.getSettings(socket.uid, next);
		},
		targetUid: function (next) {
			if (data.author) {
				user.getUidByUserslug(data.author, next);
			} else {
				next();
			}
		}
	}, function (err, results) {
		var infScrollTopicsPerPage = 20;
		var set = 'topics:recent';
		var reverse = true;

		var start = Math.max(0, parseInt(data.after, 10));

		if (data.direction === -1) {
			start = start - (reverse ? infScrollTopicsPerPage : -infScrollTopicsPerPage);
		}

		var stop = start + infScrollTopicsPerPage - 1;

		start = Math.max(0, start);
		stop = Math.max(0, stop);

		topics.getRecentTopics(null, socket.uid, start, stop, null, function (err, res) {
			if (err) {
				return callback(err);
			}
			
			var newTopic = [];
			res.topics.forEach(function(item,index){
				if(item.rootCid == data.cid){
					newTopic.push(item);
				}
			})
			
			for (var i = 0; i < newTopic.length; ++i) {
				newTopic[i].index = start + i;
			}

			res.topics = newTopic;

			res.privileges = results.privileges;
			res.template = {
				category: true,
				name: 'category'
			};

			callback(null, res);
		});
	})
};

module.exports = SocketTopics;
