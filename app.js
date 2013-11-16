'use strict';

var env = require('./config/local.js');

//process cmd-line args for environment
var args = process.argv.splice(2);
args.forEach(function(arg) {
	var parts = arg.split('=');
	switch (parts[0]) {
	case '-e':
	case '-env':
		env = require('./config/' + parts[1] + '.js');
		break;
	}
});

var nStatic = require('node-static'); //require
var fileServer = new nStatic.Server(env.staticDirectory); //create

//use native node http and proxy the request and response to
//the node static instance
require('http').createServer(function(request, response) {
	request.addListener('end', function() {
		// Serve files
		fileServer.serve(request, response);
	}).resume();
}).listen(env.port);