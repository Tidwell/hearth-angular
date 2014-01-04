/*
	Depends on: Module, Server

	Subscribes:
		server:configure - adds socketio
*/
var util = require('util');
var path = require('path');
var fs = require('fs');
var express = require('express');
var io = require('socket.io');

var Module = require('./core/module').Module;

var Socket = exports.Socket = function(options, events) {
	//call parent constructor
	Module.call(this, options);
	var self = this;

	var socketOptions = self.options.get('socket');

	events.on('server:configure', function(app, httpServer) {
		var socketServer = io.listen(httpServer, {log: socketOptions.log});
		events.emit('socket:ready', socketServer);

		socketServer.sockets.on('connection', function(socket) {
			events.emit('socket:connection', socket);
		});
	});
};

util.inherits(Socket, Module);