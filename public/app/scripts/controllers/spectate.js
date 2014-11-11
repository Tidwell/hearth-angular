'use strict';

angular.module('hearthApp')
	.controller('SpectateCtrl', function($scope,$routeParams, tournaments, activeTournament,chat) {
		$scope.tournamentId = $routeParams.id;
		$scope.t = tournaments.get();
		$scope.encode = chat.encode;
		$scope.found = true;

		$scope.confirmJoin = function(tournament) {
			activeTournament.join(tournament);
			
		};

		$scope.$watch('t.tournaments', function(){
			$scope.found = false;
			$scope.t.tournaments.forEach(function(tny){
				if (tny.tournament.url === $scope.tournamentId) {
					$scope.tournament = tny;
					$scope.found = true;
				}
			});
		});

	});