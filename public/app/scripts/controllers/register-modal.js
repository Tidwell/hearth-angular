'use strict';

angular.module('hearthApp')
	.controller('RegisterModalCtrl', function LoginCtrl($scope, dialog, user) {
		$scope.user = user.get();

		$scope.register = user.register;

		$scope.cancel = function() {
			$('.modal-backdrop').hide();
			dialog.close('cancel');
		};

		$scope.$watch('user.user.registered', function() {
			if ($scope.user.user.registered) {
				$('.modal-backdrop').hide();
				dialog.close('ok');
			}
		})
	});