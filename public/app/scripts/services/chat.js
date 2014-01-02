'use strict';

angular.module('hearthApp')
	.service('chat', function Chat(socket, user) {
		var u = user.get();
		var c = {
			generalChat: '',
			tournamentChat: '',
			chatLog: [],
			tournamentChatLog: []
		};

			
		socket.on('chat:message', function(obj){
			var toAdd;
			if (obj.room === 'generalChat') {
				toAdd = c.chatLog;
			} else {
				toAdd = c.tournamentChatLog;
			}
			toAdd.push(obj);
		});

		

		function sendChat(room, msg) {
			if (!msg) { return; }
			var toAdd;
			if (room === 'generalChat') {
				toAdd = c.chatLog;
			} else {
				toAdd = c.tournamentChatLog;
			}
			socket.emit('chat:message', {
				room: room,
				msg: msg
			});
			toAdd.push({
				msg: msg,
				user: u.user.userName
			});
		};

		return {
			get: function() {
				return c;
			},
			sendChat: sendChat
		};
	});