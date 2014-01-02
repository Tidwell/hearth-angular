'use strict';

angular.module('hearthApp')
	.controller('SpectateCtrl', function($scope,$routeParams, socket, tournaments) {
		$scope.tournamentId = $routeParams.id;
		$scope.t = tournaments.get();
		$scope.found = true;

		function view() {
			//$scope.tournamentName = tournament.tournament.name;
			$('.view-iframe').challonge($scope.tournamentId, {subdomain: 'hs_tourney', theme: '2', multiplier: '1.0', match_width_multiplier: '1.0', show_final_results: '0', show_standings: '0'});
		}

		$scope.$watch('t.tournaments', function(){
			$scope.found = false;
			$scope.t.tournaments.forEach(function(tny){
				if (tny.tournament.url === $scope.tournamentId) {
					$scope.activeTournament = tny;
					view();
					$scope.found = true;
				}
			});
		});

	});