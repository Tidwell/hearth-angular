'use strict';

angular.module('hearthApp')
	.controller('TournamentInfoCtrl', function($scope, user, $dialog, activeTournament) {

		$scope.user = user.get();
		$scope.at = activeTournament.get();
		
		$scope.init = function(tournament) {
			$scope.tournament = tournament;
		};

		$scope.join = function(tournament) {
			var d = $dialog.dialog({
				backdrop: true,
				keyboard: true,
				backdropClick: true,
				templateUrl: 'views/join-modal.html',
				controller: 'JoinModalCtrl',
				resolve: {
					tournament: function() {
						return tournament;
					}
				}
			});
			d.open().then(function(result) {
				if (result) {
					activeTournament.join(result);
				}
			});
		};
	});