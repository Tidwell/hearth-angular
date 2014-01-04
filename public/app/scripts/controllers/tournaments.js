'use strict';

angular.module('hearthApp')
	.controller('TournamentsCtrl', function($scope, $location, $dialog, socket, tournaments, user, activeTournament, chat) {
		$scope.user = user.get();
		$scope.tournaments = tournaments.get();
		$scope.at = activeTournament.get();
		$scope.chat = chat.get();

		$scope.sendChat = chat.sendChat;
		$scope.join = activeTournament.join;
		$scope.countUsers = user.countUsers;

		$scope.showUsers = false;

		socket.on('tournaments:joined', function(data) {
			if (!data) { return; }
			$location.path('/play/'+data.participant.tournamentUrl);
		});

		socket.on('tournaments:multijoin', function() {
			alert('You are already in a tournament.');
		});

		$scope.isActive = function(tournament) {
			if (!tournament || !tournament.tournament) { return false; }
			if (tournament.tournament.state === 'pending' || tournament.tournament.state === 'underway') {
				return true;
			}
			return false;
		};

		$scope.$watch('chat.chatLog.length', function(){
			//TODO make directive
			var objDiv = document.getElementById('general-chat');
			if (!objDiv) { return; }
			//next tick so it properly changes the height after the DOM is rerendered
			setTimeout(function() {
				objDiv.scrollTop = objDiv.scrollHeight;
			},0)
		});
	});