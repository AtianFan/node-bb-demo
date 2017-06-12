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
<div class="row zte-index">
	<div class="col-lg-12 col-sm-12 zte-index-left" has-widget-class="col-lg-9 col-sm-12" has-widget-target="sidebar">
		<div class="col-lg-12 col-sm-12" widget-area="header"></div>
		<div class="col-lg-12 col-sm-12" has-widget-target="sidebar">
			<div class="col-lg-6 col-sm-12 bodyLeft" widget-area="bodyLeft">123</div>
			<div class="col-lg-6 col-sm-12 bodyRight" widget-area="bodyRight">321</div>
		</div>
	</div>
	<div widget-area="sidebar" class="col-lg-3 col-sm-12 hidden"></div>
</div>
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
			<!--a href="">订阅微信</a-->
			<span>Copyright © 2015-2016 中兴软创技术社区. All rights reserved.</span>
			<span class="version-span">Version 1.0</span>
		</div>
	</div>

	<script>
		require(['forum/footer']);
	</script>
</body>
</html>
