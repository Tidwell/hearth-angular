'use strict';

angular.module('hearthApp')
	.controller('JoinModalCtrl', function JoinCtrl($scope, dialog, tournament) {
		$scope.tournament = tournament;

		$scope.region = function(name) {
			if (name.indexOf('[NA]') !== -1) {
				return 'North American';
			} else {
				return 'European';
			}
		};

		$scope.join = function() {
			dialog.close(true);
		};

		$scope.cancel = function() {
			dialog.close(false);
		};
	});