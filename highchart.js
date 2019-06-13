

  <script language="javascript" src="js/jquery.min.js"></script><%-- JQuery --%>
	<link rel="stylesheet" href="css/bootstrap.min.css"><%-- 부트스트랩 css --%>
	<script language="javascript" src="js/bootstrap.js"></script><%-- 부트스트랩 --%>
	<link rel="stylesheet" type="text/css" href="css/bootstrap-datepicker3.min.css" /><%-- 부트스트랩 Datepicker css --%>
	<script type="text/javascript" src="js/bootstrap-datepicker.min.js"></script><%-- 부트스트랩 Datepicker --%>
	<script src="https://code.highcharts.com/highcharts.js"></script><%-- Highchart --%>
	<script src="https://code.highcharts.com/modules/no-data-to-display.js"></script><%-- Highchart Module(No Data) --%>

/**
 * (Area) 통계 차트 Ajax
 */

function getStats(chartType) {
	var chartStartDate = $("#startDate").datepicker("getFormattedDate", "yyyymmdd");
	var chartEndDate = $("#endDate").datepicker("getFormattedDate", "yyyymmdd");
	var dateTimeInterval = (chartStartDate == chartEndDate) ? 3600 * 1000 : 24 * 3600 * 1000; // 시간별 : 일별
	xhr_02 = $.ajax({
		type: "POST",
		cache : false,
		// async : false,
		dataType: "json",
		url: contextPath +"/stats.do",
		data: { startDate: chartStartDate, endDate: chartEndDate, gameId: $("#gameId").val(), chartType: chartType }, // 파라미터
		success: function(data) {
			if(data.resultCode == 200) {
				drawChart_area(data.list, Number($("#startPoint").val()), dateTimeInterval); // 통계 차트 그리기
				$("#areaChart_tab>li").each(function(idx) { // Tab nonActive
					if($("#areaChart_tab_" + idx).attr('class') == 'active') { $("#areaChart_tab_" + idx).attr('class', 'nonActive'); }
				});
				$("#areaChart_tab_" + chartType).attr('class', 'active'); // Tab active
			}
		},
		error: function(e) {
			if(e.statusText != "abort") {
				console.log(eval(e));
			}
		}
	});
}



/**
 * (Total) 통계 차트 그리기
 */
function drawChart_total(reportTotalArr, killTotalArr, startPoint, interval) {
	$('#container_totalStats').highcharts({
		title: { text: null, style: {fontSize: '20px', fontWeight: 'bold'} },
		colors: ["#F7B208", "#F37538"],
		xAxis: { allowDecimals: false, type: 'datetime', dateTimeLabelFormats: { hour: '%Hh', day: '%m/%d', week: '%m/%d', month: '%m/%d', year: '%Y/%m/%d' } },
		yAxis: { min: 0, title: { text: '' }, stackLabels: { format: '{total:,1f}', enabled: true, style: { fontWeight: 'bold', color: (Highcharts.theme && Highcharts.theme.textColor) || '#555' } } }, // Bar Total Count
		credits: { enabled: false },
		tooltip: { shared: true, crosshairs: [true]
			, headerFormat: '<span style="font-size:12px; font-weight:bold; font-family:sans-serif;">{point.key:%Y/%m/%d}</span><br/>'
			, pointFormat: '<span style="color:{point.color}">\u25CF</span><span style="font-size:12px; font-family:sans-serif;"> {series.name}: </span><span style="font-size:12px; font-weight:bold; font-family:sans-serif;">{point.y:,1f}</span><span style="font-size:12px; font-weight:normal;"> ({point.percentage:.1f}%)</span><br/>' 
		},
		labels: { items: [{ style: { right: '10px', top: '18px', color: (Highcharts.theme && Highcharts.theme.textColor) || 'black' } }] },
        plotOptions: {
        	series: { 
        		events: {
        	    	legendItemClick: function(event) { // area 차트 레이블 선택 시 visible 상태 변경
                        var selectedIndex = this.index; // 현재 선택한 index
                        var allSeries = this.chart.series; // 전체 시리즈
                        var visibleIndexArray = []; // visible인 index 배열
                        $.each(allSeries, function(index, series) { if(series.visible == true) { visibleIndexArray.push(index); } }); // 현재 visible인 index 배열 저장
                        if((visibleIndexArray.length == 1) && (selectedIndex == visibleIndexArray[0])) { // visible이 하나이고, 현재 선택한 index와 visible인 index가 같은 경우
                        	$.each(allSeries, function(index, series) { series.show(); }); // 전체 시리즈를 visible로 변경
                        } else if(visibleIndexArray.length == allSeries.length) { // visible이 전체인 경우
                        	$.each(allSeries, function(index, series) {
                    			if(selectedIndex == index) { series.show(); // 현재 선택한 index의 시리즈를 visible로 변경
                    			} else { series.hide(); } // 이 외 index의 시리즈들은 hide로 변경
                    		});
                        } else { // 이 외의 경우
                        	if(allSeries[selectedIndex].visible == true) { allSeries[selectedIndex].hide(); } else { allSeries[selectedIndex].show(); } // 현재 선택한 시리즈가 visible이면 hide로 변경, hide이면 visible로 변경
                        }
                        return false;
                    }
        	    }
        		, pointStart: startPoint, pointInterval: interval }
			, column: { stacking: 'normal', dataLabels: { enabled: false, color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || '#CDCDCD', style: { textShadow: '0 0 1px white' } } }
		},
		series: [{ type: 'column', name: 'Reported', data: reportTotalArr }, { type: 'column', name: 'Killed', data: killTotalArr }],
		legend: { enabled: true, verticalAlign:'bottom', itemDistance:0, itemWidth:100, itemStyle:{ color:'#333333', fontSize:'12px', fontWeight:'normal', textOverflow:'ellipsis' } }
	});
}

/**
 * (Area) 통계 차트 그리기
 */
function drawChart_area(seriesArray, startPoint, interval) {
	$('#container_area').highcharts({ 
        chart: { type: 'area' },
        colors: ["#9ED6E0", "#FFD33F", "#2ECC71", "#3A8115", "#7A80B8", "#D8FA19", "#489AD8", "#FAABA8", "#425944", "#FF689B"
        		, "#F67C00", "#7A5449", "#85CDFF", "#BAA88D", "#E8524B", "#C7D9D9", "#115D8C", "#A9B8D6", "#A8BF3C", "#759796"
        		, "#96D7AC", "#207245", "#DB865A", "#439944", "#364A73", "#E4E5E9", "#A1D250", "#2474A6", "#7EB27C", "#F2A30F", "#8B8A86"],
        title: { text: null },
		credits: { enabled: false },
        xAxis: { allowDecimals: false, type: 'datetime', dateTimeLabelFormats: { hour: '%Hh', day: '%m/%d', week: '%m/%d', month: '%m/%d', year: '%Y/%m/%d' }, height: 300 },
        yAxis: { title: { text: '' }, height: 300, reversedStacks: false },
        tooltip: { shared: true, crosshairs: { dashStyle : 'Dash' }
        	, headerFormat: '<span style="font-size:12px; font-weight:bold; font-family:sans-serif;">{point.x:%Y/%m/%d}</span><br/>'
            , pointFormat: '<span style="color:{point.color}">\u25CF</span><span style="font-size:12px; font-family:sans-serif;"> {series.name}: </span>' 
            					+ '<span style="font-size:12px; font-weight:bold; font-family:sans-serif;">{point.y:,1f}</span><br/>'
        },
        plotOptions: { 
        	series: {
        	    events: {
        	    	legendItemClick: function(event) { // area 차트 레이블 선택 시 visible 상태 변경
                        var selectedIndex = this.index; // 현재 선택한 index
                        var allSeries = this.chart.series; // 전체 시리즈
                        var visibleIndexArray = []; // visible인 index 배열
                        $.each(allSeries, function(index, series) { if(series.visible == true) { visibleIndexArray.push(index); } }); // 현재 visible인 index 배열 저장
                        if((visibleIndexArray.length == 1) && (selectedIndex == visibleIndexArray[0])) { // visible이 하나이고, 현재 선택한 index와 visible인 index가 같은 경우
                        	$.each(allSeries, function(index, series) { series.show(); }); // 전체 시리즈를 visible로 변경
                        } else if(visibleIndexArray.length == allSeries.length) { // visible이 전체인 경우
                        	$.each(allSeries, function(index, series) {
                    			if(selectedIndex == index) { series.show(); // 현재 선택한 index의 시리즈를 visible로 변경
                    			} else { series.hide(); } // 이 외 index의 시리즈들은 hide로 변경
                    		});
                        } else { // 이 외의 경우
                        	if(allSeries[selectedIndex].visible == true) { allSeries[selectedIndex].hide(); } else { allSeries[selectedIndex].show(); } // 현재 선택한 시리즈가 visible이면 hide로 변경, hide이면 visible로 변경
                        }
                        return false;
                    }
        	    }
        	}
        	, area: { pointStart: startPoint, pointInterval: interval, marker: { enabled: false, symbol: 'circle', states: { hover: { enabled: true } } } } },
        series: seriesArray,
        legend: { verticalAlign: 'top', align: 'left', x: 50, y: 342, floating: true, itemDistance:35, itemWidth:270, itemStyle:{ color:'#333333', fontSize:'12px', fontWeight:'normal', textOverflow:'ellipsis' } }
    });
}

/**
 * Top 10 (Pie) 통계 차트
 */
function drawChart_pie(seriesArray, containerId, width, colors) {
	$(containerId).highcharts({ 
        chart: { type: 'pie', width: width }, 
        colors: colors,
        title: { text: null },
		credits: { enabled: false },
		tooltip: { shared: true, crosshairs: [true]
			, headerFormat: '<span style="color:{point.color}">\u25CF</span><span style="font-size:13px; font-weight:normal; font-family:sans-serif;"> {point.key}: </span><br/>'
			, pointFormat: '<span style="font-size:13px; font-weight:bold; font-family:sans-serif;">{point.y:,1f}</span><span style="font-size:13px; font-weight:normal;"> ({point.percentage:.1f}%)</span>' 
		},
		legend: { layout: 'vertical', verticalAlign: 'top', align: 'left', x: 0, y: 145, floating: true, itemDistance:0, itemWidth:290, itemStyle:{ color:'#333333', fontSize:'12px', fontWeight:'normal', textOverflow:'ellipsis' }
        	, labelFormatter: function() {
        		var rate = this.rate;
                var count = ((this.y != null) ? this.y.format() : "0");
    			var legend = "";
                var legendName = this.name;
                var wordCount = (31 - count.length);
                if(legendName.length > wordCount) {
                	legendName = legendName.substring(0, (wordCount-1)) + "<span style=\"font-size:12px; font-family:sans-serif;\">...</span>";
                }
                legend = "<span style=\"font-size:12px;\">" + legendName + ": </span>"
                			+ "	<span style=\"font-size:12px; font-family:sans-serif; font-weight:bold;\"> " + count + "</span>"
                			+ "<span style=\"font-size:11px; font-family:sans-serif;\"> (" + rate + "%)</span>"
           		return legend;
    		}
    	},
        plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', dataLabels: { enabled: false }, showInLegend: true, innerSize: 80, size: 220, startAngle: -90, endAngle: 90, center: [122, 120] } }, 
        series: seriesArray,
        noData: { position: { align: 'left', x: 85, verticalAlign: 'middle' } }
    });
}
