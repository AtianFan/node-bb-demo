"use strict";
/* global define, config, templates, app, utils, ajaxify, socket */

define('forum/zte-project', [
	'forum/infinitescroll'
], function (infinitescroll) {
	var Project = {};

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

		$('.contribute-div,#act-echarts,.project-body .content,.project-list').css('width',(winWidth*0.76-padLeft-50));
		$('.contribute span').css('margin-right',50);
	}

	Project.echarts = function () {
        var commitsDevLegendData = [];
        var commitsDevSeriesData = [];
        var commitsDevTotalNums = 0;
        var commitsDevTmpObj = {};

        var commitsProTmpObj = {};

        if(ajaxify.data.gitlabData){
            //取得每个人commits的百分值
            ajaxify.data.gitlabData.projects.forEach(function(it,i){

                commitsProTmpObj[ajaxify.data.children[i].name] = 0;

                it.contributors.forEach(function(item,index){
                    //取得commits的总和
                    commitsDevTotalNums += parseInt(item.commits);
                    commitsProTmpObj[ajaxify.data.children[i].name] += parseInt(item.commits)

                    if(commitsDevTmpObj[item.name]){
                        commitsDevTmpObj[item.name] = commitsDevTmpObj[item.name] + parseInt(item.commits);
                    }else{
                        commitsDevTmpObj[item.name] = parseInt(item.commits);
                    }
                })
            })

            commitsDevTmpObj = sortReverseObj(commitsDevTmpObj);
            
            $("#commitsDevNum").html(commitsDevTmpObj.length)
            
            var commitsMergeObj = {};
            //合并名字重复的值
            commitsDevTmpObj.forEach(function(item,index){

                if(ajaxify.data.gitlabData.user_merge[item[1]]){
                    var tmp = ajaxify.data.gitlabData.user_merge[item[1]];

                    if(commitsMergeObj[tmp]){
                        commitsMergeObj[tmp] += parseInt(item[0]); 
                    }else{
                        commitsMergeObj[tmp] = parseInt(item[0]); 
                    }
                }else{
                    commitsMergeObj[item[1]] = parseInt(item[0]); 
                }
            })
            var j = 0;
            //取得每个人commits的百分值
            for(var i in commitsMergeObj){
                if(j > 10){
                    break;
                }
                commitsDevLegendData.push({
                    name: i + ' ' + (commitsMergeObj[i]/commitsDevTotalNums*100).toFixed(2) + '%',
                    textStyle:{fontFamily:'Microsoft YaHei', fontSize:'13'}
                });
                commitsDevSeriesData.push({
                    value: commitsMergeObj[i],
                    name: i + ' ' + (commitsMergeObj[i]/commitsDevTotalNums*100).toFixed(2) + '%'
                });
                j++
            }
        }

		var commitsDevChart = echarts.init(document.getElementById('commits-dev-echarts'));
		var commitsDevOption = {
            legend: {
                orient : 'vertical',
                x : 20,
                y : 70,
                formatter: function (name) {
                    var num = Math.ceil(commitsDevTotalNums*(name.substring(name.lastIndexOf(' ')+1).replace('%',''))*0.01);
                    return name.substring(0, name.lastIndexOf(' ')) + ' ' + num;
                },
                tooltip: {
                    show: true
                },
                data:commitsDevLegendData
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
                    data:commitsDevSeriesData
                }
            ]
        }

        commitsDevChart.setOption(commitsDevOption);


        var rowsDevLegendData = [];
        var rowsDevSeriesData = [];
        var rowsDevTotalNums = 0;
        var rowsDevTmpObj = {};

        var rowsProTmpObj = {};

        if(ajaxify.data.gitlabData){
            ajaxify.data.gitlabData.projects.forEach(function(it,i){
                rowsProTmpObj[ajaxify.data.children[i].name] = 0;

                it.commitRows.forEach(function(item,index){
                    if(index == 2){
                        rowsDevTotalNums += parseInt(item.match(/\d+/)[0]);
                        rowsProTmpObj[ajaxify.data.children[i].name] = parseInt(item.match(/\d+/)[0]);
                    }

                    var itemArr = item.replace(/\s+/g," ").split(" ");
                    if(index > 3 && itemArr.length > 1){
                        if(rowsDevTmpObj[itemArr[2]]){
                            rowsDevTmpObj[itemArr[2]] = rowsDevTmpObj[itemArr[2]] + parseInt(itemArr[1]);
                        }else{
                            rowsDevTmpObj[itemArr[2]] = parseInt(itemArr[1]);
                        }
                    }
                })
            })
            
            rowsDevTmpObj = sortReverseObj(rowsDevTmpObj);

            var rowsMergeObj = {};
            //合并名字重复的值
            rowsDevTmpObj.forEach(function(item,index){

                if(ajaxify.data.gitlabData.user_merge[item[1]]){
                    var tmp = ajaxify.data.gitlabData.user_merge[item[1]];

                    if(rowsMergeObj[tmp]){
                        rowsMergeObj[tmp] += parseInt(item[0]); 
                    }else{
                        rowsMergeObj[tmp] = parseInt(item[0]); 
                    }
                }else{
                    rowsMergeObj[item[1]] = parseInt(item[0]); 
                }
            })
            var k = 0;
            //取得每个人commits的百分值
            for(var i in rowsMergeObj){
                if(k > 10){
                    break;
                }
                rowsDevLegendData.push({
                    name: i + " " + (rowsMergeObj[i] / rowsDevTotalNums * 100).toFixed(2) + "%",
                    textStyle: {
                        fontFamily: "Microsoft YaHei",
                        fontSize: "13"
                    }
                });
                rowsDevSeriesData.push({
                    value: rowsMergeObj[i],
                    name: i + " " + (rowsMergeObj[i] / rowsDevTotalNums * 100).toFixed(2) + "%"
                })
                k++
            }

            // rowsDevTmpObj.forEach(function(item, index) {
            //     if (index > 10) {
            //         return
            //     }
            //     rowsDevLegendData.push({
            //         name: item[1] + " " + (item[0] / rowsDevTotalNums * 100).toFixed(2) + "%",
            //         textStyle: {
            //             fontFamily: "Microsoft YaHei",
            //             fontSize: "13"
            //         }
            //     });
            //     rowsDevSeriesData.push({
            //         value: item[0],
            //         name: item[1] + " " + (item[0] / rowsDevTotalNums * 100).toFixed(2) + "%"
            //     })
            // })
        }

        var rowsDevChart = echarts.init(document.getElementById('rows-dev-echarts'));
		var rowsDevOption = {
            legend: {
                orient : 'vertical',
                x : 20,
                y : 70,
                textStyle:{color:'#646464',fontSize : '14',},
                formatter: function (name) {
                    var num = Math.ceil(rowsDevTotalNums*(name.substring(name.lastIndexOf(' ')+1).replace('%',''))*0.01);
                    return name.substring(0, name.lastIndexOf(' ')) + ' ' + num;
                },
                tooltip: {
                    show: true
                },
                data:rowsDevLegendData
            },
            series : [
                {
                    name:'123',
                    type:'pie',
                    radius : '55%',
                    center : ['60%', '50%'],
                    label: {
                        normal : {
                            textStyle: {
                                fontSize : '14'
                            }
                        }
                    },
                    data:rowsDevSeriesData
                }
            ]
        }

        rowsDevChart.setOption(rowsDevOption);

        var commitsProLegendData = [];
        var commitsProSeriesData = [];
        var commitsProTotalNums = commitsDevTotalNums;

        commitsProTmpObj = sortReverseObj(commitsProTmpObj);

        commitsProTmpObj.forEach(function (item,index) {
            if(index > 10){
                return
            }
            commitsProLegendData.push({
                name: item[1] + ' ' + (item[0]/commitsProTotalNums*100).toFixed(2) + '%',
                textStyle:{fontFamily:'Microsoft YaHei', fontSize:'13'}
            });
            commitsProSeriesData.push({
                value: item[0],
                name: item[1] + ' ' + (item[0]/commitsProTotalNums*100).toFixed(2)  + '%'
            });
        })

        var commitsProChart = echarts.init(document.getElementById('commits-pro-echarts'));
        var commitsProOption = {
            legend: {
                orient : 'vertical',
                x : 20,
                y : 70,
                formatter: function (name) {
                    var num = Math.ceil(commitsDevTotalNums*(name.substring(name.lastIndexOf(' ')+1).replace('%',''))*0.01);
                    return name.substring(0,name.lastIndexOf(' ')) + ' ' + num;
                },
                tooltip: {
                    show: true
                },
                data:commitsProLegendData
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
                    data:commitsProSeriesData
                }
            ]
        }

        commitsProChart.setOption(commitsProOption);

        var rowsProLegendData = [];
        var rowsProSeriesData = [];
        var rowsProTotalNums = rowsDevTotalNums;

        rowsProTmpObj = sortReverseObj(rowsProTmpObj);

        rowsProTmpObj.forEach(function (item,index) {
            if(index > 10){
                return
            }
            rowsProLegendData.push({
                name: item[1] + ' ' + (item[0]/rowsProTotalNums*100).toFixed(2)  + '%',
                textStyle:{fontFamily:'Microsoft YaHei', fontSize:'13'}
            });
            rowsProSeriesData.push({
                value: item[0],
                name: item[1] + ' ' + (item[0]/rowsProTotalNums*100).toFixed(2)  + '%'
            });
        })

        var rowsProChart = echarts.init(document.getElementById('rows-pro-echarts'));
        var rowsProOption = {
            legend: {
                orient : 'vertical',
                x : 20,
                y : 70,
                formatter: function (name) {
                    var num = Math.ceil(rowsDevTotalNums*(name.substring(name.lastIndexOf(' ')+1).replace('%',''))*0.01);
                    return name.substring(0, name.lastIndexOf(' ')) + ' ' + num;
                },
                tooltip: {
                    show: true
                },
                data:rowsProLegendData
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
                    data:rowsProSeriesData
                }
            ]
        }
        rowsProChart.setOption(rowsProOption);
        
	}

    function sortReverseObj(obj) {
        var arr = [];
        for (var i in obj) {
            arr.push([obj[i],i]);
        };
        arr.sort(function (a,b) {
            return b[0] - a[0];
        });

        return arr;
    }

	return Project;
});
