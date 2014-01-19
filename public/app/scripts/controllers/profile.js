'use strict';

angular.module('hearthApp')
	.controller('ProfileCtrl', function($scope, user, tournaments) {
		$scope.user = user.get();
		$scope.tournaments = tournaments.get();
		$scope.myTournaments = [];

		function fetch() {
			$scope.myTournaments = [];
			$scope.tournaments.tournaments.forEach(function(t){
				t.tournament.participants.forEach(function(p) {
					if (p.participant.name == $scope.user.user.userName) {
						t.rank = p.participant.finalRank;
						$scope.myTournaments.push(t);
					}
				});
			})
		}

		$scope.$watch('tournaments.tournaments', fetch);
		$scope.$watch('user.user.loggedIn', fetch);
	});