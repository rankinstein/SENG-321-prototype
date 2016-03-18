var drawTerm = function (context) {
	var template = $('#TermSection-template').html();
	var templateScript = Handlebars.compile(template);
	var html = templateScript(context);
	$(".list-inline").eq(0).append(html);
};

var createCourse = function (context) {
	// Retrieve the template data from the HTML (jQuery is used here).
	var template = $('#CourseOffering-template').html();

	// Compile the template data into a function
	var templateScript = Handlebars.compile(template);
	var html = templateScript(context);

	// Insert the HTML code into the page
	$(".TermCourses").last().append(html);
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
	var start_term = "Fall";
	var start_year = 2000;
	var num_terms = 12;
	var termObj = termCounter(start_term, start_year);
	for(var i = 0; i < num_terms; i++){
		drawTerm(termObj.next());
	}
	
	createCourse({
		"label" : "CSC 361",
		"title" : "Computer Communication and Networks"
	});

	document.getElementById("closeCourseMenu").addEventListener("click", function(){ $.sidr('close', 'sidr') });

	$("div[class~='CourseItem']").draggable({
		"opacity": 0.5, 
		"containment": "body",
		"appendTo": ".TermCourses",
		"connectToSortable": ".TermCourses",
		"scroll": false,
		"start": function(event, ui){
			$("body").mousemove(function(e) {
				var overlay = $("div[class~='ui-sortable-helper']");
				overlay.css('left',e.clientX);
				overlay.css('top',e.clientY);
			})
		},
		"stop": function(event, ui){
			$("body").unbind('mousemove');
		}
	});

	$( "div[class~='TermCourses']" ).sortable({
		"tolerance": "intersect",
		"connectWith": ".CourseItem",
		"opacity": 0.5});


});
