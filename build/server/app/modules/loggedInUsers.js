/*
	Depends on: Module, Server

	Subscribes:
		socket:ready - adds socketio
*/
var util = require('util');

var Module = require('./core/module').Module;

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

		socket.on('user:list', function() {
			socket.emit('user:list', self.allUsers);
		});
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

	if (!data || !data.battleTag.length || !self.validBattleTag(data.battleTag)) {
		socket.emit('user:loginerror', 'Invalid BattleTag.');
		return;
	}

	self.options.get('userModel').findOne({battleTag: data.battleTag}, function(err, user){
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
		if (user) {
			socket.set('user', user);
			data.registered = true;
			delete data.password;
		}
		self.socketServer.sockets.emit('user:login', data.battleTag);
		socket.emit('user:loggedIn', data);
		self.events.emit('loggedInUsers:loggedIn', socket);
	});
};

LoggedInUsers.prototype.register = function(socket,data) {
	var self = this;
	var UserModel = self.options.get('userModel');

	if (!data.battleTag) {
		socket.emit('user:loginerror', 'Invalid BattleTag.');
		return;
	}
	if (!data.password || data.password.length < 5) {
		socket.emit('user:registererror', 'Password too short. Must be 5 characters or more.');
		return;
	}

	UserModel.findOne({battleTag: data.battleTag}, function(err, user){
		if (user) {
			socket.emit('user:registererror', 'BattleTag already Registered.');
		} else {
			var u = new UserModel();
			u.battleTag = data.battleTag;
			u.password = data.password;
			u.save(function() {	
				socket.set('user', u);
				data.registered = true;
				delete data.password;

				socket.emit('user:loggedIn', data);
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
};

//https://us.battle.net/support/en/article/BattleTagNamingPolicy
LoggedInUsers.prototype.validBattleTag = function(tag) {
	//turn off
	var console = {log: function() {}};

	//Numbers are allowed, but a BattleTag cannot start with a number.
	if (!isNaN(Number(tag[0]))) { console.log('first not number'); return false; }

	//Mixed capitals are allowed (ex: TeRrAnMaRiNe).
	
	//must contain a #
	if (tag.indexOf('#') === -1) {
		console.log('no #')
		return false;
	}

	//everything after the hash has to be a number
	var battleTagPrefix = tag.split('#')[0];
	var battleTagSuffix = Number(tag.split('#')[1]);
	if (isNaN(battleTagSuffix) || !battleTagSuffix) {
		console.log('invalid suffix')
		return false;
	}

	//The BattleTag must be between 3-12 characters long.
	if (battleTagPrefix.length < 3 || battleTagPrefix.length > 12) { console.log('bad length'); return false; }

	
	//	No spaces or symbols are allowed (“, *, #, +, etc.).
	//	todo check to see if only exceptions are accents
	//	Accented characters are allowed.
	//	yea this is broken
	
	if (!(/^[a-zA-Z0-9#]*$/).test(battleTagPrefix)) {
		console.log('no special')
		return false;
	}

	return true;
}