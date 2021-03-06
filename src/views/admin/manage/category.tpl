<div class="row">
	<form role="form" class="category" data-cid="{category.cid}">
		<ul class="nav nav-pills">
			<li class="active"><a href="#category-settings" data-toggle="tab">
				[[admin/manage/categories:settings]]
			</a></li>
			<li><a href="#privileges" data-toggle="tab">[[admin/manage/categories:privileges]]</a></li>
		</ul>
		<br />
		<div class="tab-content">
			<div class="tab-pane fade active in row" id="category-settings">
				<div class="col-md-9">
					<div class="category-settings-form">
						<fieldset>
							<label for="cid-{category.cid}-name">
								[[admin/manage/categories:name]]
							</label>
							<input id="cid-{category.cid}-name" type="text" class="form-control" placeholder="[[admin/manage/categories:name]]" data-name="name" value="{category.name}" /><br />

							<label for="cid-{category.cid}-description">
								[[admin/manage/categories:description]]
							</label>
							<input id="cid-{category.cid}-description" data-name="description" placeholder="[[admin/manage/categories:description]]" value="{category.description}" class="form-control category_description description" /><br />
						</fieldset>

						<fieldset class="row">
							<div class="col-sm-4 col-xs-12">
								<div class="form-group">
									<label for="cid-{category.cid}-bgColor">
										[[admin/manage/categories:bg-color]]
									</label>
									<input id="cid-{category.cid}-bgColor" placeholder="#0059b2" data-name="bgColor" value="{category.bgColor}" class="form-control category_bgColor" />
								</div>
							</div>
							<div class="col-sm-4 col-xs-12">
								<div class="form-group">
									<label for="cid-{category.cid}-color">
										[[admin/manage/categories:text-color]]
									</label>
									<input id="cid-{category.cid}-color" placeholder="#fff" data-name="color" value="{category.color}" class="form-control category_color" />
								</div>
							</div>
							<div class="col-sm-4 col-xs-12">
								<div class="form-group">
									<label for="cid-{category.cid}-imageClass">
										[[admin/manage/categories:bg-image-size]]
									</label>
									<select id="cid-{category.cid}-imageClass" class="form-control" data-name="imageClass" data-value="{category.imageClass}">
										<option value="auto">auto</option>
										<option value="cover">cover</option>
										<option value="contain">contain</option>
									</select>
								</div>
							</div><br />
							<div class="col-sm-4 col-xs-12">
								<div class="form-group">
									<label for="cid-{category.cid}-tpl">
										[[admin/manage/categories:tpl]]
									</label>
									<select id="cid-{category.cid}-tpl" class="form-control" data-name="tpl" data-value="{category.tpl}">
										<option value="0">default</option>
										<option value="1">project</option>
										<option value="2">sub-project</option>
										<option value="3">third-project</option>
									</select>
								</div>
							</div>
							<div class="col-sm-4 col-xs-12">
								<div class="form-group">
									<label for="cid-{category.cid}-class">
										[[admin/manage/categories:custom-class]]
									</label>
									<input id="cid-{category.cid}-class" type="text" class="form-control" placeholder="col-md-6 col-xs-6" data-name="class" value="{category.class}" />
								</div>
							</div>
							<div class="col-sm-4 col-xs-12">
								<div class="form-group">
									<label for="cid-{category.cid}-numRecentReplies">
										[[admin/manage/categories:num-recent-replies]]
									</label>
									<input id="cid-{category.cid}-numRecentReplies" type="text" class="form-control" placeholder="2" data-name="numRecentReplies" value="{category.numRecentReplies}" />
								</div>
							</div><br />
							<div class="col-sm-4 col-xs-12">
								<div class="form-group">
									<label for="cid-{category.cid}-link">
										[[admin/manage/categories:ext-link]]
									</label>
									<input id="cid-{category.cid}-link" type="text" class="form-control" placeholder="http://domain.com" data-name="link" value="{category.link}" />
								</div>
							</div>
							<div class="col-sm-8 col-xs-12">
								<div class="form-group">
									<label for="cid-{category.cid}-gitlabLink">
										gitlab链接
									</label>
									<input id="cid-{category.cid}-gitlabLink" type="text" class="form-control" placeholder="http://gitlab.ztesoft.com/..." data-name="gitlabLink" value="{category.gitlabLink}" />
								</div>
							</div>
							<div class="col-sm-8 col-xs-12 hidden">
								<div class="form-group">
									<label for="cid-{category.cid}-contributors">
										贡献者数
									</label>
									<input id="cid-{category.cid}-contributors" type="text" class="form-control" placeholder="0" data-name="contributors" value="{category.contributors}" />
								</div>
							</div><br />
							<div class="col-sm-8 col-xs-12">
								<div class="form-group">
									<label for="cid-{category.cid}-gitlabWiki">
										wiki介绍地址
									</label>
									<input id="cid-{category.cid}-gitlabWiki" type="text" class="form-control" placeholder="gitlab项目的wiki地址" data-name="gitlabWiki" value="{category.gitlabWiki}" />
								</div>
							</div><br />
							<div class="col-sm-8 col-xs-12">
								<div class="form-group">
									<label for="cid-{category.cid}-gitlabLink">
										站点演示
									</label>
									<input id="cid-{category.cid}-webLink" type="text" class="form-control" placeholder="http://fish.ztesoft.com/fish-show/..." data-name="webLink" value="{category.webLink}" />
								</div>
							</div>
						</fieldset>
						<fieldset>
							<label for="tag-whitelist">Tag Whitelist</label><br />
							<input id="tag-whitelist" type="text" class="form-control" placeholder="Enter category tags here" data-name="tagWhitelist" value="" />
						</fieldset>
						<fieldset>
						<textarea class="write" id="readme" style="padding: 20px;width: 100%;border: 1px solid #ddd;height: 400px;margin-top: 20px;" id="cid-{category.cid}-readme" data-name="readme" data-value="{category.readme}" tabindex="4" data-mentions="1"></textarea>
						</fieldset>
					</div>
				</div>

				<div class="col-md-3 options acp-sidebar">
					<div class="panel panel-default">
						<div class="panel-body">
							<div class="category-preview" style="
								<!-- IF category.backgroundImage -->background-image: url({category.backgroundImage});<!-- ENDIF category.backgroundImage -->
								<!-- IF category.bgColor -->background-color: {category.bgColor};<!-- ENDIF category.bgColor -->
								<!-- IF category.imageClass -->background-size: {category.imageClass};<!-- ENDIF category.imageClass -->
								color: {category.color};
							">
								<div class="icon">
									<i data-name="icon" value="{category.icon}" class="fa {category.icon} fa-2x"></i>
								</div>
							</div>
							<div class="btn-group btn-group-justified">
								<div class="btn-group">
									<button type="button" data-cid="{category.cid}" class="btn btn-default upload-button">
										<i class="fa fa-upload"></i> 
										[[admin/manage/categories:upload-image]]
									</button>
								</div>
								<!-- IF category.image -->
								<div class="btn-group">
									<button class="btn btn-warning delete-image">
										<i data-name="icon" value="fa-times" class="fa fa-times"></i> 
										[[admin/manage/categories:delete-image]]
									</button>
								</div>
								<!-- ENDIF category.image -->
							</div><br />

							<fieldset>
								<div class="form-group text-center">
									<label for="category-image">
										[[admin/manage/categories:category-image]]
									</label>
									<br/>
									<input id="category-image" type="text" class="form-control" placeholder="[[admin/manage/categories:category-image]]" data-name="image" value="{category.image}" />
								</div>
							</fieldset>

							<fieldset>
								<div class="form-group text-center">
									<label for="cid-{category.cid}-parentCid">[[admin/manage/categories:parent-category]]</label>
									<br/>
									<div class="btn-group <!-- IF !category.parent.name -->hide<!-- ENDIF !category.parent.name -->">
										<button type="button" class="btn btn-default" data-action="changeParent" data-parentCid="{category.parent.cid}"><i class="fa {category.parent.icon}"></i> {category.parent.name}</button>
										<button type="button" class="btn btn-warning" data-action="removeParent" data-parentCid="{category.parent.cid}"><i class="fa fa-times"></i></button>
									</div>
									<button type="button" class="btn btn-default btn-block <!-- IF category.parent.name -->hide<!-- ENDIF category.parent.name -->" data-action="setParent">
										<i class="fa fa-sitemap"></i> 
										[[admin/manage/categories:parent-category-none]]
									</button>
								</div>
							</fieldset>
							<hr/>
							<button class="btn btn-info btn-block copy-settings">
								<i class="fa fa-files-o"></i> [[admin/manage/categories:copy-settings]]
							</button>
							<hr />
							<button class="btn btn-danger btn-block purge">
								<i class="fa fa-eraser"></i> [[admin/manage/categories:purge]]
							</button>
						</div>
					</div>
				</div>
			</div>

			<div class="tab-pane fade col-xs-12" id="privileges">
				<p>
					[[admin/manage/categories:privileges.description]]
				</p>
				<p class="text-warning">
					[[admin/manage/categories:privileges.warning]]
				</p>
				<hr />
				<div class="privilege-table-container">
					<!-- IMPORT admin/partials/categories/privileges.tpl -->
				</div>
			</div>
		</div>
	</form>
</div>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
    <i class="material-icons">save</i>
</button>
