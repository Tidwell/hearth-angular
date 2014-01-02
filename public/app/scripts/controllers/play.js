'use strict';

angular.module('hearthApp')
	.controller('PlayCtrl', function($scope, activeTournament, user, $location, chat) {
		$scope.user = user.get();
		$scope.at = activeTournament.get();
		$scope.chat = chat.get();

		$scope.sendChat = chat.sendChat;
		$scope.countUsers = user.countUsers;

		$scope.showUsers = false;

		$scope.drop = activeTournament.drop;

		$scope.$watch('at.participant', function() {
			if (!$scope.at.participant) {
				console.log('re')
				$location.path('/tournaments');
			}
		});
	});