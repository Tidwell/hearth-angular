'use strict';

angular.module('hearthApp')
	.controller('NavCtrl', function($scope, user, activeTournament, $location) {
		$scope.user = user.get();

		$scope.at = activeTournament.get();

		$scope.login = user.login;
		$scope.countUsers = user.countUsers;

		$scope.navClass = function(page) {
			var currentRoute = $location.path().substring(1).split('/')[0] || 'tournaments';
			if (typeof page === 'string') {
				return page === currentRoute ? 'active' : '';
			}
			return page.indexOf(currentRoute) !== -1 ? 'active' : '';
		};
	});