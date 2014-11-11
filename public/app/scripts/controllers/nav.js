'use strict';

angular.module('hearthApp')
	.controller('NavCtrl', function($scope, user, activeTournament, $location, $dialog) {
		$scope.user = user.get();

		$scope.at = activeTournament.get();

		$scope.login = user.login;
		$scope.logout = function() {
			user.logout();
			$location.url('/');
			$scope.at = activeTournament.reset();
		}
		$scope.countUsers = user.countUsers;

		$scope.navClass = function(page) {
			var currentRoute = $location.path().substring(1).split('/')[0] || 'tournaments';
			if (typeof page === 'string') {
				return page === currentRoute ? 'active' : '';
			}
			return page.indexOf(currentRoute) !== -1 ? 'active' : '';
		};

		$scope.showlogin = function() {
			var d = $dialog.dialog({
				backdrop: true,
				keyboard: true,
				backdropClick: true,
				templateUrl: 'views/login-modal.html',
				controller: 'LoginModalCtrl'
			});
			d.open().then(function(result) {});
		};

		$scope.showRegister = function() {
			var d = $dialog.dialog({
				backdrop: true,
				keyboard: true,
				backdropClick: true,
				templateUrl: 'views/register-modal.html',
				controller: 'RegisterModalCtrl'
			});
			d.open().then(function(result) {});
		};

		$scope.btHelp = function() {
			var d = $dialog.dialog({
				backdrop: true,
				keyboard: true,
				backdropClick: true,
				templateUrl: 'views/battletag-modal.html',
				controller: 'BattletagModalCtrl'
			});
			d.open();
		};
	});