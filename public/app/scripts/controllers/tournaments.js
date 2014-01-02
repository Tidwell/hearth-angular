'use strict';

angular.module('hearthApp')
	.controller('TournamentsCtrl', function($scope, $location, socket, tournaments, user, activeTournament, chat) {
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

		$scope.isActive = function(tournament) {
			if (!tournament || !tournament.tournament) { return false; }
			if (tournament.tournament.state === 'pending' || tournament.tournament.state === 'underway') {
				return true;
			}
			return false;
		};
	});