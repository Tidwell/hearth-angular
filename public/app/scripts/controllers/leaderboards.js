'use strict';

angular.module('hearthApp')
	.controller('LeaderboardsCtrl', function($scope, chat) {
		$scope.encode = chat.encode;
		$scope.leaderboardLimit = 2000;
		$scope.showInfo = true;
	});