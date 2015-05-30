'use strict';

angular.module('hearthApp')
	.controller('PlayCtrl', function($scope, activeTournament, user, $location, chat, socket, $dialog) {
		$scope.user = user.get();
		$scope.at = activeTournament.get();
		$scope.chat = chat.get();

		$scope.sendChat = chat.sendChat;
		$scope.encode = chat.encode;
		$scope.countUsers = user.countUsers;
		$scope.needsSubmit = true;

		$scope.showUsers = false;

		$scope.getReportedWinner = function() {
			if (!$scope.at.winnerReport) { return; }
			if (Number($scope.at.winnerReport) === Number($scope.at.match.match.player1Id)) {
				return $scope.at.match.player1Name;
			} else {
				return $scope.at.match.player2Name;
			}
		}

		$scope.drop = function() {
			var d = $dialog.dialog({
				backdrop: true,
				keyboard: true,
				backdropClick: true,
				templateUrl: 'views/drop-modal.html',
				controller: 'DropModalCtrl',
			});
			d.open().then(function(result) {});
		};
		$scope.sendResult = function() {
			activeTournament.sendResult();
			$scope.needsSubmit = false;
		};

		$scope.$watch('at.participant', function() {
			if (!$scope.at.participant) {
				$location.path('/tournaments');
			}
		});

		$scope.isOnline = function(userName) {
			if (!$scope.user) { return; }
			if ($scope.user.user.userList[userName]) {
				return true;
			}
			return false;
		};

		$scope.$watch('at.dropped', function() {
			if (!$scope.at.dropped) { return; }
			var d = $dialog.dialog({
				backdrop: true,
				keyboard: true,
				backdropClick: true,
				templateUrl: 'views/tournament-end-modal.html',
				controller: 'TournamentEndModalCtrl',
				resolve: {
					state: function() { return 'dropped'; }
				}
			});
			d.open().then(function(result) {});
			$scope.at.dropped = false;
		});

		$scope.$watch('at.eliminated', function() {
			if (!$scope.at.eliminated) { return; }
			var d = $dialog.dialog({
				backdrop: true,
				keyboard: true,
				backdropClick: true,
				templateUrl: 'views/tournament-end-modal.html',
				controller: 'TournamentEndModalCtrl',
				resolve: {
					state: function() { return 'eliminated'; }
				}
			});
			d.open().then(function(result) {});
			$scope.at.eliminated = false;
		});

		$scope.$watch('at.won', function() {
			if (!$scope.at.won) { return; }
			var d = $dialog.dialog({
				backdrop: true,
				keyboard: true,
				backdropClick: true,
				templateUrl: 'views/tournament-end-modal.html',
				controller: 'TournamentEndModalCtrl',
				resolve: {
					state: function() { return 'victory'; }
				}
			});
			d.open().then(function(result) {});
			$scope.at.won = false;
			$scope.needsSubmit = true;
			$scope.at.winnerReport = '';
			$scope.at.matchError = false;

		});

		$scope.$watch('at.win', function() {
			if (!$scope.at.win) { return; }
			var d = $dialog.dialog({
				backdrop: true,
				keyboard: true,
				backdropClick: true,
				templateUrl: 'views/tournament-end-modal.html',
				controller: 'TournamentEndModalCtrl',
				resolve: {
					state: function() { return 'victorymatch'; }
				}
			});
			d.open().then(function(result) {});
			$scope.at.win = false;
			$scope.needsSubmit = true;
			$scope.at.winnerReport = '';
			$scope.at.matchError = false;
		});
		function scrollChat() {
			//TODO make directive
			var objDiv = document.getElementById('tournament-chat');
			if (!objDiv) { return; }
			//next tick so it properly changes the height after the DOM is rerendered
			setTimeout(function() {
				objDiv.scrollTop = objDiv.scrollHeight;
			},0)
		}
		$scope.$watch('chat.tournamentChatLog.length', scrollChat);
		setTimeout(scrollChat,500); //hack
	});