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
			//取得commits的总和
			ajaxify.data.gitlabData.contributors.member_contributions.forEach(function(item,index){
				commitsTotalNums += parseInt(item.commits);
			})

            $("#commitsDevNum").html(ajaxify.data.gitlabData.contributors.member_contributions.length)

			//取得每个人commits的百分值
			ajaxify.data.gitlabData.contributors.member_contributions.forEach(function(item,index){
				if(index < 10){
					commitsLegendData.push({
						name: item.name + ' ' + (parseInt(item.commits)/commitsTotalNums*100).toFixed(2)+'%',
	                    textStyle:{fontFamily:'Microsoft YaHei', fontSize:'16'}
					});
					commitsSeriesData.push({
						value: item.commits,
						name: item.name + ' ' + (parseInt(item.commits)/commitsTotalNums*100).toFixed(2)+'%'
					});
				}else{
					commitsOthers += parseInt(item.commits);
				}
			})

			commitsLegendData.push({
				name: 'others ' + Math.floor(commitsOthers/commitsTotalNums*100)+'%',
                textStyle:{fontFamily:'Microsoft YaHei', fontSize:'16'}
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
                y : 50,
                textStyle:{color:'#646464',fontSize : '14',},
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
                                fontSize : '16'
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
			//取得additions和deletions的总和
			//取得每个人additions、deletions和的百分值
			ajaxify.data.gitlabData.commitRows.forEach(function(item,index){
				var itemArr = item.replace(/\s+/g," ").split(" ");
				if(index < 14 && index > 3 && itemArr.length > 1){
					rowsLegendData.push({
						name: itemArr[2] + ' ' + itemArr[3],
	                    textStyle:{fontFamily:'Microsoft YaHei', fontSize:'16'}
					});
					rowsSeriesData.push({
						value: itemArr[1],
						name: itemArr[2] + ' ' + itemArr[3]
					});
				}else if( index >= 14 && itemArr.length > 1){
					rowsOthers += parseInt(itemArr[1]);
				}
			})
			rowsLegendData.push({
				name: 'others ' + (rowsOthers/rowsTotalNums*100).toFixed(2)+'%',
                textStyle:{fontFamily:'Microsoft YaHei', fontSize:'16'}
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
                y : 50,
                textStyle:{color:'#646464',fontSize : '14',},
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
                                fontSize : '16'
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

		if(ajaxify.data.gitlabData){
			for(var i in ajaxify.data.gitlabData.commits){
				//取2017-04-01T00:00.000+08:00中的day数值
				seriesData[parseInt(i.slice(8,10))-1]++;
				commitsNum++
			}
		}

		$("#time-durations").html("社区" + fullYear + "-" + month + "月份数据");
		$("#commits-durations").html("最近一个月提交总次数：" + commitsNum);
		$("#aver-durations").html("平均每天提交次数：" + Math.floor(commitsNum/preMonthLastDay));
		$("#authors-durations").html("总计" + ajaxify.data.gitlabData.contributors.member_contributions.length + "贡献者");

        var actChart = echarts.init(document.getElementById('act-echarts'));
		var actOption = {
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
