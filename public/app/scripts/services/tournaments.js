'use strict';

angular.module('hearthApp')
	.service('tournaments', function Tournaments(socket) {
		var t = {
			tournaments: []
		};

		socket.on('tournaments:list', function(data){
			t.tournaments = data;
		});

		return {
			get: function() {
				socket.emit('tournaments:list');
				return t;
			}
		}
	});