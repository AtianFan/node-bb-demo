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