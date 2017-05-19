"use strict";
/* global define, config, templates, app, utils, ajaxify, socket */

define('forum/zte-subproject', [
	'forum/infinitescroll'
], function (infinitescroll) {
	var Project = {};

	function removeListeners() {
		socket.removeListener('event:new_topic', Category.onNewTopic);
		categoryTools.removeListeners();
	}

	Project.init = function () {

		Project.cssSet();
		$('.project-body').removeClass('hidden');
		Project.echarts();

		$(".contribute span").click(function(e){
			$(this).siblings('span').removeClass('on');
			$(this).addClass('on');
			$(this).siblings('.contribute-div').addClass('hidden');
			$('#'+$(this).attr('id')+'-echarts').removeClass('hidden');
		})

		$(window).resize(function(){
			Project.cssSet();
		});		

	};

	Project.cssSet = function () {
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

		$('.contribute-div,#act-echarts').css('width',(winWidth*0.76-padLeft-50));
		$('.contribute span').css('margin-right',50);
	}

	Project.echarts = function () {
		var commitsChart = echarts.init(document.getElementById('commits-echarts'));
		var commitsOption = {
            legend: {
                orient : 'vertical',
                x : 20,
                y : 50,
                textStyle:{color:'#646464',fontSize : '14',},
                formatter: function (name) {
                    name = name.replace('%','0');
                    return name;
                },
                tooltip: {
                    show: true
                },
                data:[
	                {
	                    name:'王小虎 20%',
	                    textStyle:{fontFamily:'Microsoft YaHei', fontSize:'22'}
	                },
                    {
                        name:'黄兴晖 80%',
                        textStyle : {fontFamily:'Microsoft YaHei', fontSize:'22'}
                    }]
            },
            series : [
                {
                    name:'123',
                    type:'pie',
                    radius : '55%',
                    center : ['50%', '50%'],
                    label: {
                        normal : {
                            textStyle: {
                                fontSize : '22'
                            }
                        }
                    },
                    data:[
                        {
                            value:200,
                            name:'王小虎 20%'
                        },
                        {
                            value:800,
                            name:'黄兴晖 80%'
                        }
                    ]
                }
            ]
        }
        commitsChart.setOption(commitsOption);

        var rowsChart = echarts.init(document.getElementById('rows-echarts'));
		var rowsOption = {
            legend: {
                orient : 'vertical',
                x : 20,
                y : 50,
                textStyle:{color:'#646464',fontSize : '14',},
                formatter: function (name) {
                    name = name.replace('%','0');
                    return name;
                },
                tooltip: {
                    show: true
                },
                data:[
	                {
	                    name:'王小虎 30%',
	                    textStyle:{fontFamily:'Microsoft YaHei', fontSize:'22'}
	                },
                    {
                        name:'黄兴晖 70%',
                        textStyle : {fontFamily:'Microsoft YaHei', fontSize:'22'}
                    }]
            },
            series : [
                {
                    name:'123',
                    type:'pie',
                    radius : '55%',
                    center : ['50%', '50%'],
                    label: {
                        normal : {
                            textStyle: {
                                fontSize : '22'
                            }
                        }
                    },
                    data:[
                        {
                            value:300,
                            name:'王小虎 30%'
                        },
                        {
                            value:700,
                            name:'黄兴晖 70%'
                        }
                    ]
                }
            ]
        }
        rowsChart.setOption(rowsOption);

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
                    data : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
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
                    data:[120, 132, 101, 134, 90, 230, 210,412,235,632,737,123,523,123,646,285,352]
                }
            ]
        };
        actChart.setOption(actOption);
        
	}

	return Project;
});
