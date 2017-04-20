<div widget-area="header"></div>
<div class="row">
	<div class="category col-lg-12 col-sm-12" has-widget-class="category col-lg-9 col-sm-12" has-widget-target="sidebar">
		<div class="subcategory">
			<ul class="categories" itemscope itemtype="http://www.schema.org/ItemList">
				<!-- BEGIN children -->
					<li component="categories/category" data-cid="{../cid}" data-numRecentReplies="1" class="row clearfix">
						<meta itemprop="name" content="{../name}">
						<div class="content col-xs-12 <!-- IF config.hideCategoryLastPost -->col-md-10 col-sm-12<!-- ELSE -->col-md-7 col-sm-9<!-- ENDIF config.hideCategoryLastPost -->">
							<h2 class="title">
								<!-- IF ../link -->
								<a href="{../link}" itemprop="url" target="_blank">
								<!-- ELSE -->
									<!-- IF isProjectCommu -->
									<a href="{config.relative_path}/project/{../slug}" itemprop="url">
									<!-- ENDIF isProjectCommu -->
								<!-- ENDIF ../link -->
								{../name}
								</a><br/>
								
								<!-- IF !config.hideSubCategories -->
								{function.generateChildrenCategories}
								<!-- ENDIF !config.hideSubCategories -->
							</h2>
						</div>
					</li>
				<!-- END children -->
			</ul>
		</div>
	</div>
	<div widget-area="sidebar" class="col-lg-3 col-sm-12 hidden"></div>
</div>
<div widget-area="footer"></div>