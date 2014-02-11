'use strict';

angular.module('hearthApp')
	.controller('SpectateCtrl', function($scope,$routeParams, tournaments, activeTournament,chat) {
		$scope.tournamentId = $routeParams.id;
		$scope.t = tournaments.get();
		$scope.encode = chat.encode;
		$scope.found = true;

		function view() {
			$('.view-iframe').challonge($scope.tournamentId, {subdomain: 'hs_tourney', theme: '2', multiplier: '1.0', match_width_multiplier: '1.0', show_final_results: '0', show_standings: '0'});
		}

		$scope.confirmJoin = function(tournament) {
			activeTournament.join(tournament);
			
		};

		$scope.$watch('t.tournaments', function(){
			$scope.found = false;
			$scope.t.tournaments.forEach(function(tny){
				if (tny.tournament.url === $scope.tournamentId) {
					$scope.tournament = tny;
					view();
					$scope.found = true;
				}
			});
		});

	});