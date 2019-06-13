<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>title</title>
<%-- jQuery (부트스트랩의 자바스크립트 플러그인을 위해 필요합니다) --%>
<script type="text/javascript" src="/gs/scripts/jQueryUpload/jquery-1.11.1.min.js"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css"><%-- 합쳐지고 최소화된 최신 CSS --%>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css"><%-- 부가적인 테마 --%>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><%-- 합쳐지고 최소화된 최신 자바스크립트 --%>

<link rel="stylesheet" type="text/css" href="/gs/styles/bootstrap-datepicker3.min.css" /><%-- 부트스트랩 Datepicker css --%>
<script type="text/javascript" src="/gs/scripts/bootstrap-datepicker.min.js"></script><%-- 부트스트랩 Datepicker --%>

<script type="text/javascript">
	$(document).ready(function() {
		// Datepicker 옵션 세팅
		$('[id^="datepicker_"]').datepicker({
			format: 'yyyy/mm/dd',
			orientation: "top auto",
			autoclose: true,
			todayHighlight: true,
			todayBtn: false
		});
		
		// 셀렉트 박스 첫번째 값 가져오기
		if($("#selectList>li").length > 0) {
			$("#firstValue").val($("#selectList>li:first").attr("value"));
			$("#firstText").val($("#selectList>li:first").text());
		}
		
		// 셀렉트 박스 선택 시
		$("#selectList>li").click(function (e) {
			var selectedValue = $(this).attr("value");
			$("#selectedValue").val(selectedValue);
			$("#selectedText").val($(this).text());
			$("#selectedTextDisplay").text($(this).text());
		});
		
		// startDate 선택 시 (캘린더)
		$("#startDate").datepicker().on('changeDate', function(e) {
			if(this.value != null) {
				var startDateArray = this.value.split("/");
				if(startDateArray.length == 3) {
					var startYear = startDateArray[0];
					var startMonth = startDateArray[1];
					var startDay = startDateArray[2];
					var startDate = new Date(startYear, (startMonth-1), startDay, $("#startTime").val(), 0, 0);
					$("#timeKeyStart").val(startDate.getTime());
				}
			}
		});
		
		// startTime 선택 시 (셀렉트박스)
		$("#startTime").change(function () {
			var tempStartDate = $("#startDate").datepicker("getFormattedDate", "yyyy-mm-dd");
			var tempStartTime = $(this).val();
			var tempDate = new Date(tempStartDate + "T" + tempStartTime + ":00:00");
			$("#timeKeyStart").val(tempDate.getTime());
		});
		
		// endDate 선택 시 (캘린더)
		$("#endDate").datepicker().on('changeDate', function(e) {
			if(this.value != null) {
				var endDateArray = this.value.split("/");
				if(endDateArray.length == 3) {
					var endYear = endDateArray[0];
					var endMonth = endDateArray[1];
					var endDay = endDateArray[2];
					var endDate = new Date(endYear, (endMonth-1), endDay, $("#endTime").val(), 0, 0);
					$("#timeKeyEnd").val(endDate.getTime());
				}
			}
		});
		
		// endTime 선택 시 (셀렉트박스)
		$("#endTime").change(function () {
			var tempEndDate = $("#endDate").datepicker("getFormattedDate", "yyyy-mm-dd");
			var tempEndTime = $(this).val();
			var tempDate = new Date(tempEndDate + "T" + tempEndTime + ":00:00");
			$("#timeKeyEnd").val(tempDate.getTime());
		});
		
	});
	
	// TIMEKEY 날짜 옵션 초기화
	function initTimeKeyOption() {
		var today = new Date(); // 오늘 날짜
		$("#startDate").datepicker('setDate', today); // startDate
		$("#endDate").datepicker('setDate', today); // endDate
		$("#timeKeyStart").val(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).getTime()); // timeKeyStart
		$("#timeKeyEnd").val(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 0, 0).getTime()); // timeKeyEnd
		$("#startTime").val("00").prop("selected", true); // endTime 23시로 세팅
		$("#endTime").val("23").prop("selected", true); // endTime 23시로 세팅
	}
	
	// Ajax 리스트 조회
	function getList(currentPage) {
		$("#currentPage").val(currentPage);
		$.ajax({
	        type : 'POST',
	        url : '/getList',
	        dataType : 'html',
	        data : {
				param1 : param1,
	        	selectedPageNo : currentPage,
	        	listViewLimit : 10
	        },
	        beforeSend: function () {
	            // $('#loading').show();
	            var loading = "<div>";
	            loading += "<table class=\"table table-bordered table-condensed table-hover\">";
	            loading += "<tr>";
	            loading += "<th style=\"vertical-align:middle;\">NO</th>";
	            loading += "</tr>";
	            loading += "<tr><td colspan=\"1\" class=\"taC\">Loading..</td></tr>";
	            loading += "</table>";
	            loading += "</div>";
	       		$("#area").html(loading);
	        },
	        complete: function () {
	            // $("#loading").hide();
	        },
	        success : function (data) {  
	        	$("#area").html(data);
	        },
	        error : function(request, status, error) {
	        	console.log("* code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
	        }
	    });
	}
	
	// 페이지 선택 시
	function paging(pageNo) {
		getList(pageNo);
	}
</script>
</head>
<body>
	<input type="hidden" id="currentPage" name="currentPage" value="" />
	
	<div id="datepicker_R_total" class="input-daterange input-group date_box">
		<ul>
			<li>
				<label for="exampleInputName2">TIME_KEY</label>
			</li>
			<li style="width:168px;">
				<input type="text" class="input-sm form-control" style="cursor:pointer;" id="startDate" name="startDate" value="" readonly="readonly">
			</li>
			<li style="width:39px;">
				<select id="startTime" name="startTime">
					<c:forEach var="startTime" begin="0" end="23" varStatus="stts">
						 <fmt:formatNumber var="startTime" minIntegerDigits="2" value="${startTime}" type="number" />
						 <option value="${startTime}">${startTime}</option>
					</c:forEach>
				</select>
			</li>
			<li style="width:8px;">~</li>
			<li style="width:168px;">
				<input type="text" class="input-sm form-control" style="cursor:pointer;" id="endDate" name="endDate" value="" readonly="readonly">
			</li>
			<li style="width:39px;">
				<select id="endTime" name="endTime">
					<c:forEach var="endTime" begin="0" end="23" varStatus="stts">
						 <fmt:formatNumber var="endTime" minIntegerDigits="2" value="${endTime}" type="number" />
						 <option value="${endTime}">${endTime}</option>
					</c:forEach>
				</select>
			</li>
		</ul>
	</div>
	
	<div id="area"></div>
	<%@ include file="/WEB-INF/view/include/pageNavi.jsp" %>
	------------------------------------------------------------------------------------------------
	<div class="pager">
		<c:if test="${(pagingInfo ne null) and (pagingInfo.startPageNo ne 0)}">
			<c:if test='${pagingInfo.prevPageNo != 0}'>
				<a href="#" onclick="paging(${pagingInfo.prevPageNo});return false;">Prev</a>
			</c:if>
			<c:forEach begin="${pagingInfo.startPageNo}" end="${pagingInfo.endPageNo}" varStatus="stts">
				<a href="#" <c:if test="${stts.index == pagingInfo.selectedPageNo}">class='active'</c:if> onclick="paging(${stts.index});return false;">
					${stts.index}
				</a>
			</c:forEach>
			<c:if test='${pagingInfo.nextPageNo != 0}'>
				<a href="#" onclick="paging(${pagingInfo.nextPageNo});return false;">Next</a>
			</c:if>
		</c:if>
	</div>
	------------------------------------------------------------------------------------------------
</body>
</html>


