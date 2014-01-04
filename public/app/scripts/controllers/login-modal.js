'use strict';

angular.module('hearthApp')
	.controller('LoginModalCtrl', function LoginCtrl($scope, dialog, user) {
		$scope.user = user.get();

		$scope.login = user.login;

		$scope.cancel = function() {
			$('.modal-backdrop').hide();
			dialog.close('cancel');
		};

		$scope.$watch('user.user.loggedIn', function() {
			if ($scope.user.user.loggedIn) {
				$('.modal-backdrop').hide();
				dialog.close('ok');
			}
		})
	});