"use strict";


var async = require('async');
var nconf = require('nconf');

var db = require('../database');
var privileges = require('../privileges');
var user = require('../user');
var categories = require('../categories');
var project = require('../project');
var http = require('http');
var url = require('url');
var meta = require('../meta');
var plugins = require('../plugins');
var pagination = require('../pagination');
var helpers = require('./helpers');
var utils = require('../../public/src/utils');
var translator = require('../../public/src/modules/translator');


var projectController = {};

projectController.get = function (req, res, callback) {
	var cid = req.params.project;
	var currentPage = parseInt(req.query.page, 10) || 1;
	var pageCount = 1;
	var userPrivileges;
	var settings;

	if ((req.params.topic_index && !utils.isNumber(req.params.topic_index)) || !utils.isNumber(cid)) {
		return callback();
	}

	async.waterfall([
		function (next) {
			async.parallel({
				categoryData: function (next) {
					categories.getCategoryFields(cid, ['slug', 'disabled', 'topic_count'], next);
				},
				privileges: function (next) {
					privileges.categories.get(cid, req.uid, next);
				},
				userSettings: function (next) {
					user.getSettings(req.uid, next);
				}
			}, next);
		},
		function (results, next) {
			userPrivileges = results.privileges;

			if (!results.categoryData.slug || (results.categoryData && parseInt(results.categoryData.disabled, 10) === 1)) {
				return callback();
			}

			if (!results.privileges.read) {
				return helpers.notAllowed(req, res);
			}

			if (!res.locals.isAPI && (!req.params.slug || results.categoryData.slug !== cid + '/' + req.params.slug) && (results.categoryData.slug && results.categoryData.slug !== cid + '/')) {
				return helpers.redirect(res, '/category/' + results.categoryData.slug);
			}

			settings = results.userSettings;
			var topicIndex = utils.isNumber(req.params.topic_index) ? parseInt(req.params.topic_index, 10) - 1 : 0;
			var topicCount = parseInt(results.categoryData.topic_count, 10);
			pageCount = Math.max(1, Math.ceil(topicCount / settings.topicsPerPage));

			if (topicIndex < 0 || topicIndex > Math.max(topicCount - 1, 0)) {
				return helpers.redirect(res, '/category/' + cid + '/' + req.params.slug + (topicIndex > topicCount ? '/' + topicCount : ''));
			}

			if (settings.usePagination && (currentPage < 1 || currentPage > pageCount)) {
				return callback();
			}

			if (!settings.usePagination) {
				topicIndex = Math.max(topicIndex - (settings.topicsPerPage - 1), 0);
			} else if (!req.query.page) {
				var index = Math.max(parseInt((topicIndex || 0), 10), 0);
				currentPage = Math.ceil((index + 1) / settings.topicsPerPage);
				topicIndex = 0;
			}

			var set = 'cid:' + cid + ':tids';
			var reverse = false;
			// `sort` qs has priority over user setting
			var sort = req.query.sort || settings.categoryTopicSort;
			if (sort === 'newest_to_oldest') {
				reverse = true;
			} else if (sort === 'most_posts') {
				reverse = true;
				set = 'cid:' + cid + ':tids:posts';
			}

			var start = (currentPage - 1) * settings.topicsPerPage + topicIndex;
			var stop = start + settings.topicsPerPage - 1;

			var payload = {
				cid: cid,
				set: set,
				reverse: reverse,
				start: start,
				stop: stop,
				uid: req.uid,
				settings: settings
			};

			async.waterfall([
				function (next) {
					user.getUidByUserslug(req.query.author, next);
				},
				function (uid, next) {
					payload.targetUid = uid;
					if (uid) {
						payload.set = 'cid:' + cid + ':uid:' + uid + ':tids';
					}

					if (req.query.tag) {
						if (Array.isArray(req.query.tag)) {
							payload.set = [payload.set].concat(req.query.tag.map(function (tag) {
								return 'tag:' + tag + ':topics';
							}));
						} else {
							payload.set = [payload.set, 'tag:' + req.query.tag + ':topics'];
						}
					}
					categories.getCategoryById(payload, next);
				}
			], next);
		},
		function (categoryData, next) {

			categories.modifyTopicsByPrivilege(categoryData.topics, userPrivileges);

			if (categoryData.link) {
				db.incrObjectField('category:' + categoryData.cid, 'timesClicked');
				return res.redirect(categoryData.link);
			}

			var breadcrumbs = [
				{
					text: categoryData.name,
					url: nconf.get('relative_path') + '/' + (categoryData.tpl == '3' ? 'project' : 'category') + '/' + categoryData.slug
				}
			];
			helpers.buildCategoryBreadcrumbs(categoryData.parentCid, function (err, crumbs) {
				if (err) {
					return next(err);
				}

				if(categoryData.tpl == '3'){
					crumbs[crumbs.length-1].url = crumbs[crumbs.length-1].url.replace('category', 'project');
				}

				categoryData.breadcrumbs = crumbs.concat(breadcrumbs);
				next(null, categoryData);
			});
		},
		function (categoryData, next) {
			if (!categoryData.children.length) {
				return next(null, categoryData);
			}
			var allCategories = [];
			categories.flattenCategories(allCategories, categoryData.children);
			categories.getRecentTopicReplies(allCategories, req.uid, function (err) {
				next(err, categoryData);
			});
		}
	], function (err, categoryData) {
		if (err) {
			return callback(err);
		}

		categoryData.privileges = userPrivileges;
		categoryData.showSelect = categoryData.privileges.editable;

		res.locals.metaTags = [
			{
				name: 'title',
				content: categoryData.name
			},
			{
				property: 'og:title',
				content: categoryData.name
			},
			{
				name: 'description',
				content: categoryData.description
			},
			{
				property: "og:type",
				content: 'website'
			}
		];

		if (categoryData.backgroundImage) {
			res.locals.metaTags.push({
				name: 'og:image',
				content: categoryData.backgroundImage
			});
		}

		res.locals.linkTags = [
			{
				rel: 'alternate',
				type: 'application/rss+xml',
				href: nconf.get('url') + '/category/' + cid + '.rss'
			},
			{
				rel: 'up',
				href: nconf.get('url')
			}
		];

		if (parseInt(req.uid, 10)) {
			categories.markAsRead([cid], req.uid);
		}

		categoryData['feeds:disableRSS'] = parseInt(meta.config['feeds:disableRSS'], 10) === 1;
		categoryData.rssFeedUrl = nconf.get('relative_path') + '/category/' + categoryData.cid + '.rss';
		categoryData.title = categoryData.name;
		pageCount = Math.max(1, Math.ceil(categoryData.topic_count / settings.topicsPerPage));
		categoryData.pagination = pagination.create(currentPage, pageCount, req.query);
		categoryData.pagination.rel.forEach(function (rel) {
			rel.href = nconf.get('url') + '/category/' + categoryData.slug + rel.href;
			res.locals.linkTags.push(rel);
		});

		async.waterfall([
			function (next) {
				db.getSortedSetRange('cid:' + categoryData.parentCid + ':children', 0, -1, function (err, cids) {
					if (err) {
						return callback(err);
					}

					next(null, cids);
				});
			},
			function (cids, next) {
				categories.getCategoriesFields(cids, ['name','slug','cid','readme','backgroundImage','link','bgColor','color'], function(err, relatCates){
					if (err) {
						return callback(err);
					}
					next(null, relatCates);

				})
			},
			function (relatCates,next) {
				var selfIndex = 0;
				relatCates.forEach(function(item,index){
					if(item.cid == categoryData.cid){
						selfIndex = index;
					}
					if(item.readme){
						item.readme = item.readme.slice(0,100);
					}
				})
				relatCates.splice(selfIndex,1);
				categoryData.relatCates = relatCates;
				project.getProjectData(categoryData.cid,next);
			},
			function (projectData, next) {

				if(categoryData.readme){
					var tempData = {
						content : categoryData.readme
					}

					plugins.fireHook('filter:parse.post', {postData: tempData}, function (err, data) {
						if (err) {
							return callback(err);
						}

						categoryData.content = translator.escape(data.postData.content);

						next(null, projectData);
					});
				}else{
					next(null, projectData);
				}

			}
		],  function (err, projectData) {
			categoryData.project = projectData;
			
			var tplName = '';

			switch(categoryData.tpl){
				case '2':
					tplName = 'zte-project';
					var childrenArr = [];

					categoryData.children.forEach(function(item,index){
						if(item.gitlabLink){
							childrenArr.push(url.parse(item.gitlabLink).pathname.replace('.git',''));
						}
					})

					var host = meta.config['serviceUrl'];

					if(!categoryData.gitlabLink){
						categoryData.gitlabLink = 'http://gitlab.ztesoft.com/ngweb';
					}

					var	project_path_name = url.parse(categoryData.gitlabLink).pathname;

					var options = {  
						hostname: url.parse(host).hostname, 
						port: url.parse(host).port,
						path: '/total?repo=' + project_path_name + '&children=' + childrenArr.toString(),
						method: 'GET'  
					};  

					var gitlabData = '';

					var req_g = http.request(options, function (res_g) {  
						res_g.on('data', function (chunk) {  
							gitlabData += chunk;  
						}).on('end', function(){
							categoryData.gitlabData = JSON.parse(gitlabData);
							categoryData.gitlabLink = categoryData.gitlabLink.replace('.git', '');

							res.render(tplName, categoryData);
						})  
					});  
					
					req_g.on('error', function (e) {  
						console.log('problem with request: ' + e.message);
					});  
					
					req_g.end(); 
					break;
				case '3':
					tplName = 'zte-subproject';

					var host = meta.config['serviceUrl'];

					if(!categoryData.gitlabLink){
						res.render(tplName, categoryData);
						return;
					}
					var	project_path_name = url.parse(categoryData.gitlabLink).pathname;

					var options = {  
						hostname: url.parse(host).hostname, 
						port: url.parse(host).port,
						path: '/stat?repo=' + project_path_name,
						method: 'GET'  
					};  

					var gitlabData = '';

					var req_g = http.request(options, function (res_g) {  
						res_g.on('data', function (chunk) {  
							gitlabData += chunk;  
						}).on('end', function(){
							categoryData.gitlabData = JSON.parse(gitlabData);
							categoryData.gitlabLink = categoryData.gitlabLink.replace('.git', '');
							categoryData.gitlabData.issues.all = parseInt(categoryData.gitlabData.issues.open) + parseInt(categoryData.gitlabData.issues.closed);
							categoryData.gitlabData.milestones.all = parseInt(categoryData.gitlabData.milestones.active) + parseInt(categoryData.gitlabData.milestones.closed);

							var size = categoryData.gitlabData.repository.repository_size
							if (size < 1024) {
								categoryData.gitlabData.repository.repository_size = size + ' B';
							} else if (size < 1024 * 1024) {
								categoryData.gitlabData.repository.repository_size = (size / 1024).toFixed(2) + ' KB';
							} else {
								categoryData.gitlabData.repository.repository_size = (size / 1024 / 1024).toFixed(2) + ' MB';
							}

							categoryData.lastTopic = categoryData.topics[categoryData.topics.length - 1];

							res.render(tplName, categoryData);
						})  
					});  
					
					req_g.on('error', function (e) {  
						console.log('problem with request: ' + e.message);  
					});  
					
					req_g.end(); 
					break;
			}

		})

		
	});
};


module.exports = projectController;
