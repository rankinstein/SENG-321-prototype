var fittedSchedule = {
	"classes": [
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
	]
};

var courses = {
	"classes": [
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
		}
	]
};

var redoState = [];
var courseState = [];
courseState.push(courses);

var restify = require('restify');

// create server
var server = restify.createServer();
server.use(restify.bodyParser());


server.get("/program", restify.serveStatic({
  directory: __dirname + "/public",
  file: 'program.html'
}));

server.get("/signup", restify.serveStatic({
  directory: __dirname + "/public",
  file: 'signup.html'
}));

server.post('/api/classes', function create(req, res, next) {
	redoState = [];
	courseState.push(courses);
	courses = req.body;
	res.send(200);
	return next();
});

server.get('/api/classes/undo', function create(req, res, next) {
	if(courseState.length > 0){
		redoState.push(courses);
		courses = courseState.pop();
		res.send(courses);
	} else {
		res.send(500);
	}
	return next();
});

server.get('/api/classes/redo', function create(req, res, next) {
	if(redoState.length > 0){
		courseState.push(courses);
		courses = redoState.pop();
		res.send(courses);
	} else {
		res.send(500);
	}
	return next();
});

server.get('/api/classes/fit', function create(req, res, next) {
	redoState = [];
	courseState.push(courses);
	courses = fittedSchedule;
	res.send(courses);
	return next();
});

server.get('/api/classes', function create(req, res, next) {
	res.send(courses);
	return next();
});

server.get(/\/?.*/, restify.serveStatic({
			directory: __dirname + "/public",
			default: 'index.html',
			match: /^((?!app.js).)*$/   // we should deny access to the application source
	 }));



// start the server
server.listen(process.env.PORT || 8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});