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
	  <img src="../../images/subproject.png">
	</div>
</div>
<div widget-area="sidebar" class="col-lg-3 col-sm-12 hidden"></div>
<div widget-area="footer"></div>