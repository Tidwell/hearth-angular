'use strict';

angular.module('hearthApp')
	.controller('DropModalCtrl', function LoginCtrl($scope, dialog, activeTournament) {
		$scope.at = activeTournament.get();

		$scope.drop = function() {
			activeTournament.drop();
			$scope.cancel();
		};

		$scope.cancel = function() {
			$('.modal-backdrop').hide();
			dialog.close('cancel');
		};
	});