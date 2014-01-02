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

		// c.$watch('chatLog.length', function(){
		// 	//TODO make directive
		// 	var objDiv = document.getElementById('general-chat');
		// 	if (!objDiv) { return; }
		// 	//next tick so it properly changes the height after the DOM is rerendered
		// 	setTimeout(function() {
		// 		objDiv.scrollTop = objDiv.scrollHeight;
		// 	},0)
		// });
		// c.$watch('tournamentChatLog.length', function(){
		// 	//TODO make directive
		// 	var objDiv = document.getElementById('tournament-chat');
		// 	if (!objDiv) { return; }
		// 	//next tick so it properly changes the height after the DOM is rerendered
		// 	setTimeout(function() {
		// 		objDiv.scrollTop = objDiv.scrollHeight;
		// 	},0)
		// });

		return {
			get: function() {
				return c;
			},
			sendChat: sendChat
		};
	});