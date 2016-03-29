
var raiseAlert = function (context) {
	$("#alert").remove();
	var template = $('#Alert-template').html();
	var templateScript = Handlebars.compile(template);
	var html = templateScript(context);
	$(".container-fluid").append(html);
}

var drawTerm = function (context) {
	var template = $('#TermSection-template').html();
	var templateScript = Handlebars.compile(template);
	var html = templateScript(context);
	$(".list-inline").eq(0).append(html);
};

var drawTerms = function (start_term, start_year, num_terms) {
	var termObj = termCounter(start_term, start_year);
	for(var i = 0; i < num_terms; i++){
		drawTerm(termObj.next());
	}
};

var clearCourses = function () {
	$("li>div[class~='TermCourses']").children("[class~='CourseItem']").remove();
};

var getCoursesInTerm = function (term, term_num) {
	var c = term.children();
	var term_list = [];
	for(var i = 0; i < c.length; i++){
		var tmp = {};
		tmp.label = c.eq(i).children('h3').text();
		tmp.title = c.eq(i).children('p').text();
		tmp.term = term_num;
		term_list.push(tmp);
	}
	return term_list;
};

var getCourseState = function () {
	var return_value = { "classes" : [] };
	var classes = [];
	var courses = [];
	var term = $("[class~='TermSection']");
	for (var i = 0; i < term.length; i++){
		var node = term.eq(i).children("[class~='TermCourses']");
		if(node.children().length > 0){
			courses = getCoursesInTerm(term.eq(i).children("[class~='TermCourses']"), i);
		}
		classes = classes.concat(courses);
		courses = [];
	}
	return_value.classes = return_value.classes.concat(classes);
	return return_value;
};

var createCourse = function (context) {
	// Retrieve the template data from the HTML (jQuery is used here).
	var template = $('#CourseOffering-template').html();

	// Compile the template data into a function
	var templateScript = Handlebars.compile(template);
	var html = templateScript(context);

	// Insert the HTML code into the page
	$("[class~='TermSection']").eq(context.term).children("[class~='TermCourses']").append(html);
	$("[id='" + context.term + "'] > [class~='TermCourses']").append(html);
};

var undoAction = function(){ 
	// Append the array of courses to the term columns
	$.ajax({
		method: "GET",
		url: "/api/classes/undo"
	})
	.done(function( resp ) {
		clearCourses();
		resp.classes.forEach(createCourse);
		makeCoursesDraggable();
	})
	.fail(function( resp, err) {
		console.log( err );
	}); 
};

var redoAction = function(){ 
	// Append the array of courses to the term columns
	$.ajax({
		method: "GET",
		url: "/api/classes/redo"
	})
	.done(function( resp ) {
		clearCourses();
		resp.classes.forEach(createCourse);
		makeCoursesDraggable();
	})
	.fail(function( resp, err) {
		console.log( err );
	});
};

var makeCoursesDraggable = function () {
	// Make all courses draggable
	$("div[class~='CourseItem']").draggable({
		"opacity": 0.5, 
		"containment": "body",
		"appendTo": ".TermCourses",
		"connectToSortable": ".TermCourses",
		"scroll": false,
		"revert": function(event) {
			if( event === false ){
				return true;
			}
			else {
				return false;
			}
		},
		"start": function(event, ui){
			$("body").mousemove(function(e) {
				var overlay = $("div[class~='ui-sortable-helper']");
				overlay.css('left',e.clientX);
				overlay.css('top',e.clientY);
			})
		},
		"stop": function(event, ui){
			$("body").unbind('mousemove');
			var state = JSON.stringify(getCourseState());

			var settings = {
				"async": true,
				"crossDomain": true,
				"url": "/api/classes",
				"method": "POST",
				"headers": {
					"content-type": "application/json"
				},
				"processData": false,
				"data": state
			}

			$.ajax(settings).done(function (response) {
			});

			raiseAlert({
				"alert_level": "info",
				"strong_text": "Note:",
				"message_text": "You can undo and redo your actions if needed."
			});
		}
	});
};

// Returns a counter which cycles through the terms and years
// when the .next() method is called.
var termCounter = function(term, year){
	var term_names = ["Spring", "Summer", "Fall"];
	var term_index = term_names.indexOf(term);
	var _year = year;
	var t_name = term;
	var t_year = year;
	return {
		"next": function () {
			t_name = term_names[term_index];
			t_year = _year;
			term_index += 1;
			if(term_index > 2){
				term_index = 0;
				_year++;
			}
			return { "term": t_name, "year": t_year};
	}};
}


$(document).ready(function () {
	'use strict';

	// Create term columns
	drawTerms("Fall", 2015, 9);

	// Append the array of courses to the term columns
	$.ajax({
		method: "GET",
		url: "/api/classes"
	})
	.done(function( resp ) {
		resp.classes.forEach(createCourse);
		makeCoursesDraggable();
	});

	// Enables the onclick event for 'close' button in the Course Management Menu
	document.getElementById("closeCourseMenu").addEventListener("click", function(){ $.sidr('close', 'sidr') });

	// undo and redo button event listeners
	document.getElementById("undoBtn").addEventListener("click", undoAction);
	document.getElementById("redoBtn").addEventListener("click", redoAction);

	document.getElementById("settingsBtn").addEventListener("click", function () { $("#settingsModal").modal() });
	

	// Enables the onclick event for 'close' button in the Course Management Menu
	document.getElementById("fitBtn").addEventListener("click", function(){ 
		$.ajax({
				method: "GET",
				url: "/api/classes/fit"
			})
			.done(function( resp ) {
				clearCourses();
				resp.classes.forEach(createCourse);
				makeCoursesDraggable();

				raiseAlert({
					"alert_level": "success",
					"strong_text": "Success!",
					"message_text": "Your schedule has been generated. You can undo and redo your actions if needed."
				});

				$.sidr('close', 'sidr');

			})
			.fail(function( resp, err) {
				console.log( err );
			}); 
	});

	// Make all term columns sortable. i.e. can drag on to
	$( "div[class~='TermCourses']" ).sortable({
		"tolerance": "intersect",
		"connectWith": ".CourseItem",
		"opacity": 0.5
	});

	// Course Management Menu settings
	$('#simple-menu').sidr({
		displace: false,
		timing: 'ease-in-out',
		speed: 500
	  });

	$("li.TermSection").eq(0).children("div.TermCourses").removeClass('TermCourses');

});

// Close course management menu when window re-sizes
$( window ).resize(function () {
  $.sidr('close', 'sidr');
});
