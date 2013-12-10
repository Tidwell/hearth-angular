/*
	Depends on: Module, Server

	Subscribes:
		server:routes - adds angular routes to the server
*/
var util = require('util');
var path = require('path');
var fs = require('fs');
var express = require('express');

var Module = require('./core/module').Module;

var AngularServer = exports.AngularServer = function(options, events) {
	//call parent constructor
	Module.call(this, options);
	var self = this;

	var serverOptions = self.options.get('angularServer');

	//generate the absolute path from the config
	serverOptions.staticPath = self.generateStaticDirectory(serverOptions.staticDirectory);

	//add the static frontend server
    events.on('server:configure', function(app){
        app.use(express.static(serverOptions.staticPath));
    });
	
	//add the routes
	events.on('server:routes', function(app){
		app.get(serverOptions.uriPath + '*', function(req,res) { //serve all /uriPath/* routes
			self.serve(req,res);
		});
	});
};

util.inherits(AngularServer, Module);

/*
	Serves the admin angular app

	If its just the uriPath route, redirect to index

	If the file exists, serve it, otherwise serve the index.html
		DANGER -- assumes single-point of entry and no 404 in admin
*/
AngularServer.prototype.serve = function(req,res) {

	console.log('ser')
	var self = this;
	var serverOptions = this.options.get('angularServer');

	//strip off the leading /uriPath portion of the url
	var path = req.path;

	//we have a real path - check if the file exists
	var file = serverOptions.staticPath + path;
	fs.exists(file, function(exists) {
		if (exists) {
			//serve it
			res.sendfile(path, {
				root: serverOptions.staticPath
			});
		} else {
			console.log('nope')
			//otherwise serve the index
			res.sendfile('index.html', {
				root: serverOptions.staticPath
			});
		}
	});
};