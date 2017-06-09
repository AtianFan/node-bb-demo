<div class="widget-cont">
	<div class="widget-title">
		<span>{title}</span>
	</div>
	<div class="post-ranking clearfix">
		<ul>
			<!-- BEGIN usersData -->
			<li>
				<div class="active-users">
					<a data-uid="{usersData.uid}" href="{relative_path}/user/{usersData.userslug}">
						<!-- IF usersData.picture -->
						<img title="{usersData.username}" src="{usersData.picture}" class="avatar avatar-sm not-responsive" />
						<!-- ELSE -->
						<div class="avatar avatar-sm not-responsive" style="background-color: {usersData.icon:bgColor};">{usersData.icon:text}</div>
						<!-- ENDIF usersData.picture -->
					</a>
					<a href="{relative_path}/user/{usersData.userslug}" class="avatar-name">{usersData.username}</a>
					<span>发帖数：{usersData.recentPosts}</span>
				</div>
			</li>
			<!-- END usersData -->
		</ul>
	</div>
</div>
