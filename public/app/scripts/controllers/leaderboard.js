'use strict';

angular.module('hearthApp')
	.controller('LeaderboardCtrl', function($scope, tournaments) {
		$scope.tournaments = tournaments.get();
		$scope.rankHash = {};
		$scope.allRatings = [];

		$scope.strip = function(s) {
			return s.split('#')[0];
		};

		function fetch() {
			$scope.rankHash = {};
			$scope.allRatings = [];
			$scope.tournaments.tournaments.forEach(function(t){
				if (!t.tournament.participants) { return; }
				t.tournament.participants.forEach(function(p) {
					if (!$scope.rankHash[p.participant.name]) {
						$scope.rankHash[p.participant.name] = {
							rating: 0,
							played: 0
						};
					}
					if (p.participant.finalRank) {
						var pts;
						if (p.participant.finalRank === 1) {
							pts = 6;
						} else if (p.participant.finalRank === 2) {
							pts = 4;
						} else if (p.participant.finalRank === 3) {
							pts = 3;
						} else if (p.participant.finalRank === 5) {
							pts = 1;
						} else {
							pts = 0;
						}
						$scope.rankHash[p.participant.name].rating += pts;
						$scope.rankHash[p.participant.name].played++;
					}
				});
			});

			for (var user in $scope.rankHash) {
				if (user !== 'Tidwell#1482') {
					$scope.allRatings.push({
						name: user,
						rating: $scope.rankHash[user].rating,
						played: $scope.rankHash[user].played
					});
				}
			}
		}

		$scope.$watch('tournaments.tournaments.length', fetch);
		$scope.$watch('user.user.loggedIn', fetch);
	});