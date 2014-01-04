'use strict';

angular.module('hearthApp')
	.controller('BrowseCtrl', function($scope, tournaments) {
		$scope.tournaments = tournaments.get();

		$scope.orderState = function(tournament) {
			return tournament.tournament.state;
		};
	});