'use strict';

angular.module('hearthApp')
	.controller('JoinModalCtrl', function JoinCtrl($scope, dialog, tournament) {
		$scope.tournament = tournament;

		$scope.join = function() {
			dialog.close(true);
		};

		$scope.cancel = function() {
			dialog.close(false);
		};
	});