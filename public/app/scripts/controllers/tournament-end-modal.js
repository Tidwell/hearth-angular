'use strict';

angular.module('hearthApp')
	.controller('TournamentEndModalCtrl', function TournamentEndModalCtrl($scope, dialog, state) {
		$scope.state = state;
		$scope.ok = function() {
			$('.modal-backdrop').hide();
			dialog.close('ok');
		};

		$scope.cancel = function() {
			$('.modal-backdrop').hide();
			dialog.close('cancel');
		};
	});