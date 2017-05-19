
'use strict';

var async = require('async');
var http = require('http');

var db = require('./database');

(function (Gitlab) {

	Gitlab.getProjectData = function (cid, callback) {
		var options = {
	        host: 'gitlab.ztesoft.com', // 请求地址 域名，google.com等..
	        path: '/api/v4/projects', // 具体路径eg:/upload
			port: '',
	        method: 'GET', // 请求方式, 这里以post为例
	        headers: { // 必选信息,  可以抓包工看一下
	            'Content-Type': 'application/json'
				// 'PRIVATE-TOKEN': 'dn1c5DsVQcLy3xcJQ44k'
	        }
	    };

	    http.get(options, function(res) {
	        var resData = "";

	        res.on("data",function(data){
	            resData += data;
	        });

	        res.on("end", function() {
	            console.log(JSON.parse(resData))
	            callback(null,JSON.parse(resData));
	        });
	    })
	};


}(exports));
