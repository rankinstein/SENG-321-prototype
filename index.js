var restify = require('restify');

// create server
var server = restify.createServer();

server.get("/program", restify.serveStatic({
  directory: __dirname + "/public",
  file: 'program.html'
}));

server.get("/signup", restify.serveStatic({
  directory: __dirname + "/public",
  file: 'signup.html'
}));

server.get(/\/?.*/, restify.serveStatic({
            directory: __dirname + "/public",
            default: 'index.html',
            match: /^((?!app.js).)*$/   // we should deny access to the application source
     }));

// start the server
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});