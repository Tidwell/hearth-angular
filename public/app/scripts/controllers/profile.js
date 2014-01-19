'use strict';

angular.module('hearthApp')
	.controller('ProfileCtrl', function($scope, user, tournaments, $routeParams) {
		$scope.user = user.get();
		$scope.tournaments = tournaments.get();
		$scope.myTournaments = [];

		if ($routeParams.battleTag) {
			$scope.battleTag = $routeParams.battleTag;
		}

		function fetch() {
			var toCheck = $scope.battleTag ? $scope.battleTag : $scope.user.user.userName;
			$scope.myTournaments = [];
			$scope.tournaments.tournaments.forEach(function(t){
				if (!t.tournament.participants) { return; }
				t.tournament.participants.forEach(function(p) {
					if (p.participant.name == toCheck) {
						t.rank = p.participant.finalRank;
						$scope.myTournaments.push(t);
					}
				});
			})
		}

		$scope.$watch('tournaments.tournaments.length', fetch);
		$scope.$watch('user.user.loggedIn', fetch);
	});