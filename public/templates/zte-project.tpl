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
	  		<i class="fa fa-upload"></i>提交代码：49
	  	</div>
	</div>
	<div class="project-body">
	  <img src="../../images/project.png">
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
