<div class="widget-bignews">
	<ul id="bignews_img" class="col-lg-6 col-sm-12">
		<!-- BEGIN bignewsData -->
		<li>
			{bignewsData.firstImg}
		</li>
		<!-- END bignewsData -->
	</ul>
	<ul id="bignews_topics" class="col-lg-6 col-sm-12" data-numtopics="{numTopics}">
		<!-- BEGIN bignewsData -->
		<li class="clearfix">
			<p class="bn-title">
				<a href="{relative_path}/topic/{bignewsData.topic.slug}">{bignewsData.topic.title}</a>
			</p>
			<p class="bn-summary">
				{bignewsData.summary}
			</p>
		</li>
		<!-- END bignewsData -->
	</ul>
</div>

<script>
'use strict';
/* globals app, socket, translator, templates, utils*/

$(document).ready(function() {
	var	topics = $('#bignews_topics');
	var imgSlick = $('#bignews_img');
	var liSlick = topics.find('li');

	app.createUserTooltips();
	processHtml(topics);

	function processHtml(html) {
		html.find('span.timeago').timeago();
	}

	imgSlick.on('beforeChange', function(event, slick, direction, nextSlide){
		liSlick.removeClass('current');
		liSlick.eq(nextSlide).addClass('current');
	});

	imgSlick.on('init', function(event, slick, direction){
		topics.find('li:first').addClass('current');
	});

	imgSlick.slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		dots: true,
		arrows: false,
		focusOnSelect: true
	});

});
</script>
