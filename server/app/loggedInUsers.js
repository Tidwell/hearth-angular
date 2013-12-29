/*
	Depends on: Module, Server

	Subscribes:
		socket:ready - adds socketio
*/
var util = require('util');
var path = require('path');
var fs = require('fs');
var express = require('express');
var io = require('socket.io');

var Module = require('./core/module').Module;

var LoggedInUsers = exports.LoggedInUsers = function(options, events) {
	//call parent constructor
	Module.call(this, options);
	var self = this;

	var LoggedInUsersOptions = self.options.get('loggedInUsers');

	var allUsers = {};
	//get a reference to the socket server
	var socketServer;
	events.on('socket:ready', function(sServer){
		socketServer = sServer;
	});

	events.on('socket:connection', function(socket){
		socket.emit('user:list', allUsers);

		socket.on('login', function(data){
			if (allUsers[data]) {
				socket.emit('user:loginerror', 'That user is already logged in.');
				return;
			}
			allUsers[data] = {auth: false};
			socket.set('userName', data);
			socketServer.sockets.emit('user:login', data);
		});

		socket.on('disconnect', function(){
			socket.get('userName', function(err,name){
				if (!err && name && allUsers[name]) {
					delete allUsers[name];
					socketServer.sockets.emit('user:logout', name);
				}
			});
		});
	});
};

util.inherits(LoggedInUsers, Module);