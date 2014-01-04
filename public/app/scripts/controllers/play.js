'use strict';

angular.module('hearthApp')
	.controller('PlayCtrl', function($scope, activeTournament, user, $location, chat, socket, $dialog) {
		$scope.user = user.get();
		$scope.at = activeTournament.get();
		$scope.chat = chat.get();

		$scope.sendChat = chat.sendChat;
		$scope.countUsers = user.countUsers;

		$scope.showUsers = false;

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
		$scope.sendResult = activeTournament.sendResult;

		function view() {
			if(!$scope.at.activeTournament || !$scope.at.activeTournament.tournament) { return; }
			$('.active-iframe').challonge($scope.at.activeTournament.tournament.url, {subdomain: 'hs_tourney', theme: '2', multiplier: '1.0', match_width_multiplier: '1.0', show_final_results: '0', show_standings: '0'});
		}

		$scope.$watch('at.activeTournament.tournament', view);

		$scope.$watch('at.participant', function() {
			if (!$scope.at.participant) {
				$location.path('/tournaments');
			}
		});

		socket.on('tournaments:dropped', function() {
			var d = $dialog.dialog({
				backdrop: true,
				keyboard: true,
				backdropClick: true,
				templateUrl: 'views/tournament-end-modal.html',
				controller: 'TournamentEndModalCtrl',
				resolve: {
					state: function() { return 'dropped' }
				}
			});
			d.open().then(function(result) {});
		});

		socket.on('tournaments:eliminated', function() {
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
		});

		socket.on('tournaments:won', function() {
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
		});

		socket.on('tournaments:win', function() {
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
		});

		$scope.$watch('chat.tournamentChatLog.length', function(){
			//TODO make directive
			var objDiv = document.getElementById('tournament-chat');
			if (!objDiv) { return; }
			//next tick so it properly changes the height after the DOM is rerendered
			setTimeout(function() {
				objDiv.scrollTop = objDiv.scrollHeight;
			},0)
		});
	});