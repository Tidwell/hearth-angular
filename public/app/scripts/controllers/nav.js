'use strict';

angular.module('hearthApp')
	.controller('NavCtrl', function($scope, user) {
		$scope.user = user.get();

		$scope.login = user.login;
		$scope.countUsers = user.countUsers;

	});