'use strict';

angular.module('hearthApp')
	.controller('TournamentEndModalCtrl', function TournamentEndModalCtrl($scope, dialog, state) {
		$scope.state = state;
		$scope.ok = function() {
			dialog.close('ok');
		};

		$scope.cancel = function() {
			dialog.close('cancel');
		};
	});