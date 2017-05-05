<div class="widget-cont widget-anno">
	<div class="widget-title">
		<span>公告</span>
	</div>

	<ul class="announce-topics widget-li">
		<!-- BEGIN topics -->
		<li class="clearfix widget-topics">
			<p>
				<a href="{relative_path}/topic/{topics.slug}">{topics.title}</a>
			</p>
			<!-- <span class="pull-right post-preview-footer">
				<span class="timeago" title="{topics.lastposttimeISO}"></span>
			</span> -->
		</li>
		<!-- END topics -->
	</ul>
</div>
<script>
'use strict';
/* globals app*/

$(document).ready(function() {
	app.createUserTooltips();
});
</script>