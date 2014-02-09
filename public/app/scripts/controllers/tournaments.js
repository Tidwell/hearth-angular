'use strict';

angular.module('hearthApp')
	.controller('TournamentsCtrl', function($scope, socket, tournaments, user, chat) {
		$scope.tournaments = tournaments.get();
		$scope.chat = chat.get();
		$scope.user = user.get();

		$scope.sendChat = chat.sendChat;
		$scope.encode = chat.encode;

		$scope.isAdmin = chat.isAdmin;

		$scope.leaderboardLimit = 10;

		$scope.countUsers = user.countUsers;

		$scope.showUsers = false;

		$scope.isActive = function(tournament) {
			if (!tournament || !tournament.tournament) { return false; }
			if (tournament.tournament.state === 'pending' || tournament.tournament.state === 'underway') {
				return true;
			}
			return false;
		};

		$scope.orderState = function(tournament) {
			return tournament.tournament.state;
		};
		function scrollChat(){
			//TODO make directive
			var objDiv = document.getElementById('general-chat');
			if (!objDiv) { return; }
			//next tick so it properly changes the height after the DOM is rerendered
			setTimeout(function() {
				objDiv.scrollTop = objDiv.scrollHeight;
			},0)
		}
		$scope.$watch('chat.chatLog.length', scrollChat);
		setTimeout(scrollChat,500); //hack
	});