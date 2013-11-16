'use strict';

var staticDirectory = './app';

var nStatic = require('node-static'); //require
var fileServer = new nStatic.Server(staticDirectory); //create

//use native node http and proxy the request and response to
//the node static instance
require('http').createServer(function(request, response) {
	request.addListener('end', function() {
		// Serve files
		fileServer.serve(request, response);
	}).resume();
}).listen(8080);