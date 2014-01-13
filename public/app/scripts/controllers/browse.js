'use strict';

angular.module('hearthApp')
	.controller('BrowseCtrl', function($scope, tournaments, activeTournament, user) {
		$scope.user = user.get();
		$scope.at = activeTournament.get();
		$scope.tournaments = tournaments.get();

		$scope.orderState = function(tournament) {
			if (tournament.tournament.state === 'complete') {
				return 'x';
			}
			return tournament.tournament.state;
		};
	});