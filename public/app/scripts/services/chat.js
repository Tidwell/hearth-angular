'use strict';

angular.module('hearthApp')
	.service('chat', function Chat(socket, user, $http) {
		var u = user.get();
		var c = {
			generalChat: '',
			tournamentChat: '',
			chatLog: [],
			tournamentChatLog: []
		};

		var banList = [];


		socket.on('chat:message', function(obj) {
			if (banList.indexOf(obj.user) !== -1) {
				return;
			}
			var toAdd;
			if (obj.room === 'generalChat') {
				toAdd = c.chatLog;
			} else {
				toAdd = c.tournamentChatLog;
			}
			toAdd.push(obj);
		});

		function clear() {
			c.tournamentChatLog = [];
		}

		socket.on('tournaments:dropped', clear);
		socket.on('tournaments:won', clear);
		socket.on('tournaments:eliminated', clear);



		function sendChat(room, msg) {
			if (!msg) {
				return;
			}
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
		}

		function pollBan() {
			$http({
				url: '/banlist.json',
				method: 'GET'
			}).success(function(data) {
				banList = data;
				setTimeout(pollBan, 15000);
			});
		}
		pollBan();

		return {
			get: function() {
				return c;
			},
			sendChat: sendChat
		};
	});