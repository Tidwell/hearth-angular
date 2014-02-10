/*
	Depends on: Module, Server, Socket, Tournament

	SERVER EVENTS
	Subscribes:
		socket:connection - subscribes to general chat
		tournaments:connect - subscribes to tournament chat room
		tournaments:reconnect - subscribes to tournament chat room

	SOCKET EVENTS (to the client)
	Emits:
		chat:message - forwarding a message back to other clients
	Subscribes:
		chat:message - client sending a message
	
*/
var util = require('util');

var Module = require('./core/module').Module;

var Chat = exports.Chat = function(options, events) {
	//call parent constructor
	Module.call(this, options);
	var self = this;

	var chatOptions = self.options.get('chat');

	events.on('socket:connection', function(socket){
		socket.join('generalChat')

		socket.on('chat:message', function(msg){
			socket.get('userName', function(err,name){
				if (!name) { return; }
				var obj = {
					msg: msg.msg,
					user: name,
					room: msg.room
				};
				socket.broadcast.to(msg.room).emit('chat:message', obj);
			});
		});
	});

	events.on('tournaments:connect', function(obj){
		if (obj.socket) {
			obj.socket.join(obj.tournamentId);
		}
	});
	events.on('tournaments:reconnect', function(obj){
		if (obj.socket){
			obj.socket.join(obj.tournamentId);
		}
	});

	events.on('tournaments:dropped', function(obj){
		if (obj.socket) {
			obj.socket.leave(obj.id);
		}
	});
	events.on('tournaments:won', function(obj){
		if (obj.socket) {
			obj.socket.leave(obj.id);
		}
	});
};

util.inherits(Chat, Module);