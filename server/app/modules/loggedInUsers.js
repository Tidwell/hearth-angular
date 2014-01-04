/*
	Depends on: Module, Server

	Subscribes:
		socket:ready - adds socketio
*/
var util = require('util');

var Module = require('./core/module').Module;

var UserModel = require('../models/user');

var LoggedInUsers = exports.LoggedInUsers = function(options, events, models) {
	options.userModel = models.user;

	//call parent constructor
	Module.call(this, options);
	var self = this;

	var LoggedInUsersOptions = self.options.get('loggedInUsers');

	self.allUsers = {};
	//get a reference to the socket server
	self.socketServer;
	events.on('socket:ready', function(sServer){
		self.socketServer = sServer;
	});

	self.events = events;

	events.on('socket:connection', function(socket){
		socket.emit('user:list', self.allUsers);

		socket.on('user:login', function(data){
			self.login(socket, data);
		});

		socket.on('user:register', function(data){
			self.register(socket, data);
		});

		socket.on('disconnect', function(){
			self.disconnect(socket);
		});
	});
};

util.inherits(LoggedInUsers, Module);

LoggedInUsers.prototype.login = function(socket,data) {
	var self = this;

	if (!data || !data.battleTag.length) {
		socket.emit('user:loginerror', 'Invalid BattleTag.');
		return;
	}

	self.options.userModel.findOne({battleTag: data.battleTag}, function(err, user){
		if (user && !data.password) {
			socket.emit('user:loginerror', 'Requires Password.');
			return;
		} else if (user && data.password) {
			if (user.password !== data.password) {
				socket.emit('user:loginerror', 'Invalid Password.');
				return;
			}
		}
		
		//log them in
		if (self.allUsers[data.battleTag]) {
			socket.emit('user:loginerror', 'That BattleTag is already logged in.');
			return;
		}
		self.allUsers[data.battleTag] = {auth: false};
		socket.set('userName', data.battleTag);
		self.socketServer.sockets.emit('user:login', data.battleTag);
		self.events.emit('loggedInUsers:loggedIn', socket);
	});
};

LoggedInUsers.prototype.register = function(socket,data) {
	var self = this;

	if (!data.battleTag) {
		socket.emit('user:loginerror', 'Invalid BattleTag.');
		return;
	}
	if (!data.password || data.password.length < 5) {
		socket.emit('user:registererror', 'Password too short. Must be 5 characters or more.');
		return;
	}

	self.options.userModel.findOne({battleTag: data.battleTag}, function(err, user){
		if (user) {
			socket.emit('user:registererror', 'BattleTag already Registered.');
		} else {
			var u = new UserModel;
			u.battleTag = data.battleTag;
			u.password = data.password;
			u.save(function() {
				self.login(socket, data);
			});
		}
	});
}

LoggedInUsers.prototype.disconnect = function(socket) {
	var self = this;

	socket.get('userName', function(err,name){
		if (!err && name && self.allUsers[name]) {
			delete self.allUsers[name];
			self.socketServer.sockets.emit('user:logout', name);
		}
	});
}