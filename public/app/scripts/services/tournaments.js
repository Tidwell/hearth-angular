'use strict';

angular.module('hearthApp')
	.service('tournaments', function Tournaments(socket, $location) {
		var t = {
			tournaments: []
		};

		socket.on('tournaments:list', function(data){
			t.tournaments = data;
		});

		socket.on('tournaments:joined', function(data) {
			if (!data) { return; }
			$location.path('/play/'+data.participant.tournamentUrl);
		});

		socket.on('tournaments:multijoin', function() {
			alert('You are already in a tournament.');
		});

		return {
			get: function() {
				socket.emit('tournaments:list');
				return t;
			}
		}
	});