<div class="widget-cont">
	<div class="widget-title">
		<span>{cateName}</span><a class="pull-right" target="_blank" href="{relative_path}/category/{cid}">我要爆料</a>
	</div>
	<ul class="popular_topics">
		<!-- BEGIN topics -->
		<li class="clearfix widget-topics">
			<p class="popular_topics_left pull-left">
				<a href="{relative_path}/topic/{topics.slug}">{topics.title}</a>
			</p>
			<div class="popular_topics_right pull-right">
				<!-- IF nums -->
				<span class="answer-span">{topics.postcount} 答</span> | <span class="view-span">{topics.viewcount} 阅</span>
				<!-- ENDIF nums -->
				<!-- IF time -->
				<div class="pull-right post-preview-footer">
					<div class="timeago" title="{topics.lastposttimeISO}"></div>
				</div>
				<!-- ENDIF time -->
			</div>
		</li>
		<!-- END topics -->
	</ul>
</div>

<script>
'use strict';
/* globals app*/

$(document).ready(function() {
	app.createUserTooltips();
	$('.popular_topics').find('span.timeago').timeago();
});
</script>