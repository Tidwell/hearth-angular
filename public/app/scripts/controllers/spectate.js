'use strict';

angular.module('hearthApp')
	.controller('SpectateCtrl', function($scope,$routeParams, socket) {
		$scope.tournamentId = $routeParams.id;

		function view() {
			//$scope.tournamentName = tournament.tournament.name;
			$('.view-iframe').challonge($scope.tournamentId, {subdomain: 'hs_tourney', theme: '2', multiplier: '1.0', match_width_multiplier: '1.0', show_final_results: '0', show_standings: '0'});
		}

		if ($scope.tournamentId) {
			socket.emit('tournaments:info', $scope.tournamentId);
		}

		socket.on('tournaments:info', function(data){
			if (data.error) {
				$scope.error = data.error;
				return;
			}
			$scope.activeTournament = data;
			view();
		});

	});