'use strict';

angular.module('hearthApp')
	.controller('JoinModalCtrl', function JoinCtrl($scope, dialog, tournament, user) {
		$scope.user = user.get();
		$scope.tournament = tournament;

		$scope.confirmJoin = function(tournament) {
			dialog.close(tournament);
		};

		$scope.cancel = function() {
			dialog.close(false);
		};
	});