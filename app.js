'use strict';

var env = require('./config/local.js');
var path = require('path');

var express = require('express');

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

var app = module.exports = express();
var server = require('http').createServer(app);

app.configure(function() {
	app.use(express.static(path.normalize(__dirname + env.staticDirectory)));
	app.use(app.router);
});

function serveIndex(req, res) {
	res.sendfile(path.normalize(__dirname + env.staticDirectory+'/index.html'));
}

app.get('/*', serveIndex);

server.listen(env.port, function() {
	console.log('Express server listening on port '+env.port);
});
