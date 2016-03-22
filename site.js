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
	drawTerms("Fall", 2000, 9);
	
	// Array of courses
	var courses = [
		{
			"label" : "CSC 361",
			"title" : "Computer Communication and Networks",
			"term"  : 1
		},
		{
			"label" : "CSC 226",
			"title" : "Algorithms and Data Structures II",
			"term"  : 1
		},
		{
			"label" : "ELEC 360",
			"title" : "Control Theory and Systems: I",
			"term"  : 1
		},
		{
			"label" : "SENG 321",
			"title" : "Requirements Engineering",
			"term"  : 1
		},
		{
			"label" : "SENG 371",
			"title" : "Software Evolution",
			"term"  : 1
		},
		{
			"label" : "Work Term 3",
			"title" : "",
			"term"  : 2
		},
		{
			"label" : "CSC 355",
			"title" : "Digital Logic and Computer Organization",
			"term"  : 3
		},
		{
			"label" : "CSC 320",
			"title" : "Foudations of Computer Science",
			"term"  : 3
		},
		{
			"label" : "CSC 360",
			"title" : "Operating Systems",
			"term"  : 3
		},
		{
			"label" : "CSC 370",
			"title" : "Database Systems",
			"term"  : 3
		},
		{
			"label" : "SENG 360",
			"title" : "Security Engineering",
			"term"  : 3
		},
		{
			"label" : "Work Term 4",
			"title" : "",
			"term"  : 4
		},
		{
			"label" : "SENG 426",
			"title" : "Software Quality Engineering",
			"term"  : 5
		},
		{
			"label" : "SENG 440",
			"title" : "Embedded Systems",
			"term"  : 5
		},
		{
			"label" : "SENG 499",
			"title" : "Technical Project",
			"term"  : 5
		},
		{
			"label" : "SENG 474",
			"title" : "Data Mining",
			"term"  : 5
		},
		{
			"label" : "ELEC 485",
			"title" : "Pattern Recognition",
			"term"  : 5
		},
		{
			"label" : "GRADUATED!",
			"title" : "",
			"term"  : 6
		}
	];

	// Append the array of courses to the term columns
	courses.forEach(createCourse);

	// Enables the onclick event for 'close' button in the Course Management Menu
	document.getElementById("closeCourseMenu").addEventListener("click", function(){ $.sidr('close', 'sidr') });

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
		}
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

});

// Close course management menu when window re-sizes
$( window ).resize(function () {
  $.sidr('close', 'sidr');
});
