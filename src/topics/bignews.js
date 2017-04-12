
'use strict';

var async = require('async');

var db = require('../database');

module.exports = function (Topics) {

	Topics.isBignews = function (tid, callback) {
		tid = parseInt(tid, 10);
		if (!tid) {
			return callback(null, false);
		}
		Topics.getTopicField(tid, 'bignews', function (err, data) {
			var isBignews;
			if(data == 'true'){
				isBignews = true;
			}else{
				isBignews = false;
			}
			callback(err, isBignews);
		});
	};

};