<!-- IF breadcrumbs.length -->
<ol class="breadcrumb">
	<!-- BEGIN breadcrumbs -->
	<li<!-- IF @last --> component="breadcrumb/current"<!-- ENDIF @last --> itemscope="itemscope" itemtype="http://data-vocabulary.org/Breadcrumb" <!-- IF @last -->class="active"<!-- ENDIF @last -->>
		<!-- IF !@last --><a href="{breadcrumbs.url}" itemprop="url"><!-- ENDIF !@last -->
			<span itemprop="title">
				{breadcrumbs.text}
				<!-- IF @last -->
				<!-- IF !feeds:disableRSS -->
				<!-- IF rssFeedUrl --><a target="_blank" href="{rssFeedUrl}"><i class="fa fa-rss-square"></i></a><!-- ENDIF rssFeedUrl --><!-- ENDIF !feeds:disableRSS -->
				<!-- ENDIF @last -->
			</span>
		<!-- IF !@last --></a><!-- ENDIF !@last -->
	</li>
	<!-- END breadcrumbs -->
</ol>
<!-- ENDIF breadcrumbs.length -->
<div widget-area="header"></div>
<div class="project" has-widget-class="project" has-widget-target="sidebar">
	<div class="project-title">
		<!-- IF backgroundImage -->
		<div class="icon" style="background-image:url('{backgroundImage}')"></div>
		<!-- ELSE -->
		<div class="icon" style="background-color: #fda34b; color: #fff;">
			<i class="fa fa-fw {icon}"></i>
		</div>
		<!-- ENDIF backgroundImage -->
		<!-- IF name -->
		<p>{name}</p>
		<!-- ENDIF name -->
		<div class="title-opr">
	    	<i class="fa fa-share-alt"></i>分享
	  		<i class="fa fa-upload"></i>提交代码：<span id="commitsDevNum">0</span>人
	  	</div>
	</div>
	<div class="project-body hidden">
		<div class="contribute-head">
			<h3>介绍</h3>
		</div>
		<div class="content">
		{content}
		</div>
		<div class="contribute">
			<div class="contribute-head">
				<h3>开发者贡献</h3>
			</div>
			<span class="commits on" id="commits">代码提交次数</span>
			<span class="rows" id="rows">代码提交行数</span>
			<div id="commits-echarts" class="contribute-div">
			</div>
			<div id="rows-echarts" style="width:500px" class="contribute-div hidden">
			</div>
	    </div>
	    <div class="activity-level">
	    	<h3>社区活跃度</h3>
	    	<p id="time-durations"></p>
	    	<ul>
	    		<li id="commits-durations"></li>
	    		<li id="aver-durations"></li>
	    		<li id="authors-durations"></li>
	    	</ul>
	    	<div id="act-echarts" class="act-echarts">
	    	</div>
	    </div>
	</div>
	<div class="project-right">
		<h4>项目管理工具</h4>
		<!-- IF gitlabData -->
		<div class="pro-item">
			<div class='sub-tit'><i class="fa fa-qrcode"></i>代码托管</div>
			<span class="pro-txt">Files</span><span class='pro-data'>{gitlabData.repository.repository_size}</span>
			<span class="pro-txt">Commits</span><span class='pro-data'>{gitlabData.repository.commit_count}</span>
			<span class="pro-txt">Branches</span><span class='pro-data'>{gitlabData.repository.branches}</span>
			<span class="pro-txt">Tags</span><span class='pro-data'>{gitlabData.repository.tags}</span>
		</div>
		<div class="pro-item">
			<div class='sub-tit'><i class="fa fa-tasks"></i>任务</div>
			<span class="pro-txt">Open</span><span class='pro-data'>{gitlabData.issues.open}</span>
			<span class="pro-txt">Closed</span><span class='pro-data'>{gitlabData.issues.closed}</span>
			<span class="pro-txt">All</span><span class='pro-data'>412</span>
		</div>
		<div class="pro-item">
			<div class='sub-tit'><i class="fa fa-flag"></i>里程碑</div>
			<span class="pro-txt">Open</span><span class='pro-data'>{gitlabData.milestones.active}</span>
			<span class="pro-txt">Closed</span><span class='pro-data'>{gitlabData.milestones.closed}</span>
			<span class="pro-txt">All</span><span class='pro-data'>412</span>
		</div>
		<div class="pro-item">
			<div class='sub-tit'><i class="fa fa-object-group"></i>知识库<span class='pro-data'>{gitlabData.wikiNums}</span></div>
			<span class="cl6">Last edit by</span> <span class="cl3">{gitlabData.lastEdit.lastEditName}</span>
			<div class="pro-time timeago cl9" title="{gitlabData.lastEdit.lastEditTime}"></div>
		</div>
		<!-- ENDIF gitlabData -->
		<!-- IF gitlabLink -->
		<div class="pro-item">
			<div class='sub-tit'><i class="fa fa-object-group"></i>站点演示</div>
			<span class="cl3">{gitlabLink}</span>
		</div>
		<!-- ENDIF gitlabLink -->
		<div class="pro-item">
			<div class='sub-tit'><i class="fa fa-object-group"></i>项目论坛</div>
			<div>
			<span class="pro-txt">主题</span><span class='pro-data'>{totalTopicCount}</span>
			<span class="pro-txt">帖子</span><span class='pro-data'>{totalPostCount}</span>
			</div>
			<!-- IF lastTopic -->
			<div class="mb7">
				<a href="{config.relative_path}/user/{lastTopic.user.userslug}" target="_blank">
					<!-- IF lastTopic.user.picture -->
					<img src="{lastTopic.user.picture}" />
					<!-- ELSE -->
					<div class="user-icon" style="background-color: {lastTopic.user.icon:bgColor};">{lastTopic.user.icon:text}</div>
					<!-- ENDIF lastTopic.user.picture -->
				</a> {lastTopic.user.username}
			</div>
			<div class="cutoff"><a href="{config.relative_path}/topic/{{lastTopic.userslug}}">{lastTopic.title}</a></div>
			<div class="pro-time cl9 timeago"  title="{lastTopic.timestampISO}"></div>
			<!-- ENDIF lastTopic -->
		</div>
		<h4>项目成员</h4>
		<div class="pro-item">
			<!-- IF gitlabData -->
				<!-- BEGIN gitlabData.project_member -->
					<!-- IF gitlabData.project_member.avatar_url -->
					<a href="http://gitlab.ztesoft.com/{gitlabData.project_member.user_name}" title="{gitlabData.project_member.user_name}" target="_blank">
						<img src="http://gitlab.ztesoft.com/uploads/user/avatar/{gitlabData.project_member.user_id}/{gitlabData.project_member.avatar_url}">
					</a>
					<!-- ELSE -->
					<a href="http://gitlab.ztesoft.com/{gitlabData.project_member.user_name}" title="{gitlabData.project_member.user_name}" target="_blank">
						<span class="fa-stack fa-lg">
							<i style="color:#A1B56C;" class="fa fa-circle fa-stack-2x"></i>
							<i style="color:#fff;" class="fa fa-stack-1x  fa-comments"></i>
						</span>
					</a>
					<!-- ENDIF gitlabData.project_member.avatar_url -->
				<!-- END gitlabData.project_member -->
			<!-- ENDIF gitlabData -->
		</div>
		<h4>关联项目</h4>
		<div class="pro-item noBr">
			<div class="pro-group">
				<!-- BEGIN relatCates -->
				<div class="pro-single-div">
					<!-- IF relatCates.backgroundImage -->
					<a href="<!-- IF relatCates.link --> {relatCates.link}<!-- ELSE -->{config.relative_path}/category/{relatCates.slug}<!-- ENDIF relatCates.link -->" style="width: 2.2em;margin-right: 2px;display: inline-block;height: 1.6em;">
						<span class="icon" style="background-image:url('{relatCates.backgroundImage}')">
						</span>
					</a>
					<!-- ELSE -->
					<a href="<!-- IF relatCates.link --> {relatCates.link}<!-- ELSE -->{config.relative_path}/category/{relatCates.slug}<!-- ENDIF relatCates.link -->">
						<span class="fa-stack fa-lg">
							<i style="color:{relatCates.bgColor};" class="fa fa-product-hunt fa-stack-2x"></i>
							<i style="color:{relatCates.color};" class="fa fa-stack-1x  {relatCates.icon}"></i>
						</span>
					</a>
					<!-- ENDIF relatCates.backgroundImage -->
					<span class="sub-title">{relatCates.name}</span>
					<span class="sub-intro cutoff">{relatCates.readme}</span>
				</div>
				<!-- END relatCates -->
			</div>
		</div>
	</div>
</div>
<div widget-area="sidebar" class="col-lg-3 col-sm-12 hidden"></div>
<div widget-area="footer"></div>
		</div><!-- END container -->
	</main>

	<div class="hide">
<script type="text/tpl" data-template="500">
&#x3C;div class=&#x22;alert alert-danger&#x22;&#x3E;
&#x9;&#x3C;strong&#x3E;[[global:500.title]]&#x3C;/strong&#x3E;
&#x9;&#x3C;p&#x3E;[[global:500.message]]&#x3C;/p&#x3E;
&#x9;&#x3C;p&#x3E;{path}&#x3C;/p&#x3E;
&#x9;&#x3C;!-- IF error --&#x3E;&#x3C;p&#x3E;{error}&#x3C;/p&#x3E;&#x3C;!-- ENDIF error --&#x3E;
&#x3C;/div&#x3E;
</script>
	</div>

	<div class="topic-search hidden">
		<div class="btn-group">
			<button type="button" class="btn btn-default count"></button>
			<button type="button" class="btn btn-default prev"><i class="fa fa-fw fa-angle-up"></i></button>
			<button type="button" class="btn btn-default next"><i class="fa fa-fw fa-angle-down"></i></button>
		</div>
	</div>

	<div component="toaster/tray" class="alert-window">
		<div id="reconnect-alert" class="alert alert-dismissable alert-warning clearfix hide" component="toaster/toast">
			<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
			<p>[[global:reconnecting-message, {config.siteTitle}]]</p>
		</div>
	</div>
	
	<div class="footer-cont">
		<div class="content">
			<a href="">关于我们</a>
			<a href="">意见反馈</a>
			<a href="">友情链接</a>
			<a href="">订阅微信</a>
			<span>Copyright © 2015-2016 中兴开发者社区. All rights reserved.</span>
			<span class="version-span">Version 1.0</span>
		</div>
	</div>

	<script>
		require(['forum/footer']);
	</script>
</body>
</html>
