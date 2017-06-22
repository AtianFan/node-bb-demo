"use strict";
/* global define, config, templates, app, utils, ajaxify, socket */

define('forum/zte-subproject', [
	'forum/infinitescroll'
], function (infinitescroll) {
	var SubProject = {};

	SubProject.init = function () {

		SubProject.cssSet();
		$('.project-body').removeClass('hidden');
		SubProject.echarts();

		$(".contribute span").click(function(e){
			$(this).siblings('span').removeClass('on');
			$(this).addClass('on');
			$(this).siblings('.contribute-div').addClass('hidden');
			$('#'+$(this).attr('id')+'-echarts').removeClass('hidden');
		})

		$(document).find('.timeago').timeago();

		$(window).resize(function(){
			SubProject.cssSet();
		});		

	};

	SubProject.cssSet = function () {
		var winWidth = $(window).width();
		var padLeft = 0;

		if(winWidth > 1200){
			padLeft = (winWidth - 1200)/2;
		}else if( 992 < winWidth < 1200){
			padLeft = (winWidth - 970)/2
		}else{
			padLeft = (winWidth - 750)/2
		}

		$('.project-body').css('padding-left',padLeft);

		$('.contribute-div,#act-echarts,.project-body .content').css('width',(winWidth*0.76-padLeft-50));
		$('.contribute span').css('margin-right',50);
	}

	SubProject.echarts = function () {
		var commitsLegendData = [];
		var commitsSeriesData = [];
		var commitsOthers = 0;
		var commitsTotalNums = 0;
		if(ajaxify.data.gitlabData){

            $("#commitsDevNum").html(ajaxify.data.gitlabData.contributors.member_contributions.length)

            var member_contributionsObj = {};
            //合并名字重复的值
            ajaxify.data.gitlabData.contributors.member_contributions.forEach(function(item,index){
                //取得commits的总和
				commitsTotalNums += parseInt(item.commits);

                if(ajaxify.data.gitlabData.user_merge[item.name]){
                    var tmp = ajaxify.data.gitlabData.user_merge[item.name];

                    if(member_contributionsObj[tmp]){
                        member_contributionsObj[tmp] += parseInt(item.commits); 
                    }else{
                        member_contributionsObj[tmp] = parseInt(item.commits); 
                    }
                }else{
                    member_contributionsObj[item.name] = parseInt(item.commits); 
                }
            })

            var j = 0;
            //取得每个人commits的百分值
            for(var i in member_contributionsObj){
				if(j < 10){
					commitsLegendData.push({
						name: i + ' ' + (parseInt(member_contributionsObj[i])/commitsTotalNums*100).toFixed(2)+'%',
	                    textStyle:{fontFamily:'Microsoft YaHei', fontSize:'13'}
					});
					commitsSeriesData.push({
						value: parseInt(member_contributionsObj[i]),
						name: i + ' ' + (parseInt(member_contributionsObj[i])/commitsTotalNums*100).toFixed(2)+'%'
					});
				}else{
					commitsOthers += parseInt(member_contributionsObj[i]);
				}
                j++;
            }

			commitsLegendData.push({
				name: 'others ' + Math.floor(commitsOthers/commitsTotalNums*100)+'%',
                textStyle:{fontSize:'13'}
			});
			commitsSeriesData.push({
				value: commitsOthers,
				name: 'others ' + Math.floor(commitsOthers/commitsTotalNums*100)+'%'
			});
		}
		var commitsChart = echarts.init(document.getElementById('commits-echarts'));
		var commitsOption = {
            legend: {
                orient : 'vertical',
                x : 20,
                y : 70,
                formatter: function (name) {
                    var num = Math.ceil(commitsTotalNums*(name.split(" ")[1].replace('%',''))*0.01);
                    return name.split(" ")[0] + ' ' +  num;
                },
                tooltip: {
                    show: true
                },
                data:commitsLegendData
            },
            series : [
                {
                    name:'123',
                    type:'pie',
                    radius : '55%',
                    center : ['55%', '50%'],
                    label: {
                        normal : {
                            textStyle: {
                                fontSize : '14'
                            }
                        }
                    },
                    data:commitsSeriesData
                }
            ]
        }
        commitsChart.setOption(commitsOption);

		var rowsLegendData = [];
		var rowsSeriesData = [];
		var rowsOthers = 0;
		var rowsTotalNums = 0;
		if(ajaxify.data.gitlabData.commitRows.length > 1){
			rowsTotalNums = ajaxify.data.gitlabData.commitRows[2].match(/\d+/)[0];
		}

		if(ajaxify.data.gitlabData){
            var commitRowsObj = {};
			ajaxify.data.gitlabData.commitRows.forEach(function(item,index){
				var itemArr = item.replace(/\s+/g," ").split(" ");
				if(index < 14 && index > 3 && itemArr.length > 1){
                    if(ajaxify.data.gitlabData.user_merge[itemArr[2]]){
                        var tmp = ajaxify.data.gitlabData.user_merge[itemArr[2]];

                        if(commitRowsObj[tmp]){
                            commitRowsObj[tmp] += parseInt(itemArr[1]); 
                        }else{
                            commitRowsObj[tmp] = parseInt(itemArr[1]); 
                        }
                    }else{
                        commitRowsObj[itemArr[2]] = parseInt(itemArr[1]); 
                    }
				}else if( index >= 14 && itemArr.length > 1){
					rowsOthers += parseInt(itemArr[1]);
				}
            })
            
            for(var i in commitRowsObj){
                rowsLegendData.push({
                    name: i + ' ' + (parseInt(commitRowsObj[i])/rowsTotalNums*100).toFixed(2)+'%',
                    textStyle:{fontFamily:'Microsoft YaHei', fontSize:'13'}
                });
                rowsSeriesData.push({
                    value: parseInt(commitRowsObj[i]),
                    name: i + ' ' + (parseInt(commitRowsObj[i])/rowsTotalNums*100).toFixed(2)+'%'
                });
            }
			rowsLegendData.push({
				name: 'others ' + (rowsOthers/rowsTotalNums*100).toFixed(2)+'%',
                textStyle:{fontFamily:'Microsoft YaHei', fontSize:'13'}
			});
			rowsSeriesData.push({
				value: rowsOthers,
				name: 'others ' + (rowsOthers/rowsTotalNums*100).toFixed(2)+'%'
			});
		}

        var rowsChart = echarts.init(document.getElementById('rows-echarts'));
		var rowsOption = {
            legend: {
                orient : 'vertical',
                x : 20,
                y : 70,
                formatter: function (name) {
                    var num = Math.ceil(rowsTotalNums*(name.split(" ")[1].replace('%',''))*0.01);
                    return name.split(" ")[0] + ' ' +  num;
                },
                tooltip: {
                    show: true
                },
                data: rowsLegendData
            },
            series : [
                {
                    name:'123',
                    type:'pie',
                    radius : '55%',
                    center : ['55%', '50%'],
                    label: {
                        normal : {
                            textStyle: {
                                fontSize : '14'
                            }
                        }
                    },
                    data: rowsSeriesData
                }
            ]
        }
        rowsChart.setOption(rowsOption);

        var date = new Date();
	    var fullYear = date.getFullYear();
	    var month = date.getMonth();
	    var firstDay = new Date(fullYear,month,1);
	    var oneDay= 1000*60*60*24;
	    var preMonthLastDay = new Date(firstDay - oneDay).getDate();
	    var xAxisData = [];
	    var seriesData = [];

		for(var j = 0; j < preMonthLastDay; j++){
			//创建[1,2,3,4...,31]数组
			xAxisData[j] = j + 1;
			//创建[0,0,0...,0]数组
			seriesData[j] = 0;
		}

		var commitsNum = 0;
        var commitsPeopleNum = 0;

		if(ajaxify.data.gitlabData){
			for(var i in ajaxify.data.gitlabData.commits){
				//取2017-04-01T00:00.000+08:00中的day数值
				seriesData[parseInt(i.slice(8,10))-1]++;
				commitsNum++
			}
            for(var i in ajaxify.data.gitlabData.commitsPeople){
                commitsPeopleNum++
            }
		}

        var createDate = ajaxify.data.gitlabData.create_time.replace(/T[\s\S]*/g,'');
        var s1 = new Date(createDate.replace(/-/g, "/"));
        var s2 = new Date();
        var runTime = 0;

        runTime = parseInt((s2.getTime() - s1.getTime()) / 1000);
        var totalDay = Math.floor(runTime / 86400);
        var runYear = Math.floor(runTime / 86400 / 365);
        runTime = runTime % (86400 * 365);
        var runMonth = Math.floor(runTime / 86400 / 30);
        runTime = runTime % (86400 * 30);
        var runDay = Math.floor(runTime / 86400);

        function concatTime(num,str){
            if(num != 0){
                return num + str;
            }else{
                return '';
            }
        }

		$("#create-at").html("项目年龄：" + concatTime(runYear,'年') + concatTime(runMonth,'个月') + concatTime(runDay,'天'));
		$("#aver-total").html('平均每天提交次数：' + Math.floor(ajaxify.data.gitlabData.repository.commit_count / totalDay));
		$("#commits-durations").html("最近一个月提交总次数：" + commitsNum);
		$("#aver-durations").html("平均每天提交次数：" + Math.floor(commitsNum/preMonthLastDay));
		$("#authors-durations").html("贡献者：" + commitsPeopleNum);

        var actChart = echarts.init(document.getElementById('act-echarts'));
		var actOption = {
            title : {
                text: fullYear + '年' + month + '月',
                x: 'center',
                y: 15
            },
            backgroundColor: '#f5f5f5',
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#88d3a1'
                    }
                }
            },
            grid: {
                left: '1%',
                right: '4%',
                bottom: '1%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : xAxisData 
                    // [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'active',
                    type:'line',
                    stack: '总量',
                    smooth: true,
                    hoverAnimation: false,
                    makeLine: {
                        lineStyle: {
                            normal: {
                                color: '#fff',
                                width: 5
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#88d3a1'
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#88d3a1'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: '#88d3a1'
                        }
                    },
                    data: seriesData
                    // [120, 132, 101, 134, 90, 230, 210,412,235,632,737,123,523,123,646,285,352]
                }
            ]
        };
        actChart.setOption(actOption);
        
	}

	return SubProject;
});
