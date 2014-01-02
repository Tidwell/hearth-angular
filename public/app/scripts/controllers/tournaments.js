'use strict';

angular.module('hearthApp')
	.controller('TournamentsCtrl', function($scope, socket, tournaments, user) {
		$scope.user = user.get();

		$scope.tournaments = tournaments.get();
		$scope.activeTournament = null;
		$scope.activeBracket;
		$scope.winnerReport = '';
		$scope.match = null;
		$scope.matchError = null;
		$scope.generalChat = '';
		$scope.chatLog = [];
		$scope.tournamentChatLog = [];

		$scope.showUsers = false;
		
		socket.on('tournaments:joined', function(data){
			$scope.participant = data;
		});

		socket.on('tournaments:activeTournament', function(data){
			$scope.activeTournament = data;
			$('.active-iframe').challonge($scope.activeTournament.tournament.url, {subdomain: 'hs_tourney', theme: '2', multiplier: '1.0', match_width_multiplier: '1.0', show_final_results: '0', show_standings: '0'});
			updateMatch();
			if ($scope.activeTournament.tournament.state === 'complete') {
				$scope.activeTournament = null;
			}
		});

		socket.on('tournaments:winnerConflict', function(data){
			if (!$scope.match) { return; }
			if ($scope.match.match.id === data.matchId) {
				$scope.matchError = data;
			}
		});

		$scope.countUsers = user.countUsers;

		var idNameMap = $scope.idNameMap = {};
		function updateMatch() {
			$scope.activeTournament.tournament.participants.forEach(function(p) {
				idNameMap[p.participant.id] = p.participant.name;
			});
			var pid = $scope.participant.participant.id;
			var activeMatch = false;
			$scope.activeTournament.tournament.matches.forEach(function(match){
				if (match.match.state === 'open' && (match.match.player1Id === pid || match.match.player2Id === pid)) {
					if ($scope.match && match.match.round !== $scope.match.match.round) {
						$scope.matchError = null;
						$scope.winnerReport = '';
					}
					$scope.match = match;
					$scope.match.player1Name = idNameMap[match.match.player1Id];
					$scope.match.player2Name = idNameMap[match.match.player2Id];
					activeMatch = true;
				}
			});
			if (!activeMatch) {
				$scope.match = null;
			}
		}

		socket.on('tournaments:dropped', function(){
			$scope.activeTournament = null;
			$scope.participant = null;
		});

		socket.on('chat:message', function(obj){
			var toAdd;
			if (obj.room === 'generalChat') {
				toAdd = $scope.chatLog;
			} else {
				toAdd = $scope.tournamentChatLog;
			}
			toAdd.push(obj);
		});

		$scope.isActive = function(tournament) {
			if (!tournament || !tournament.tournament) { return false; }
			if (tournament.tournament.state === 'pending' || tournament.tournament.state === 'underway') {
				return true;
			}
			return false;
		};

		$scope.view = function(tournament) {
			$scope.activeBracket = tournament.tournament.url;
			$scope.viewedTournamentName = tournament.tournament.name;
			$('.view-iframe').challonge(tournament.tournament.url, {subdomain: 'hs_tourney', theme: '2', multiplier: '1.0', match_width_multiplier: '1.0', show_final_results: '0', show_standings: '0'});
		};

		$scope.join = function(tournament) {
			socket.emit('tournaments:join', tournament.tournament.url);
		};

		$scope.drop = function() {
			if (confirm('Do you want to drop from '+$scope.activeTournament.tournament.name)) {
				socket.emit('tournaments:drop', $scope.activeTournament.tournament.url);
			}
		};

		$scope.sendResult = function() {
			socket.emit('tournaments:report', {
				tournamentId: $scope.activeTournament.tournament.url,
				matchId: $scope.match.match.id,
				winnerId: $scope.winnerReport
			});
		};

		$scope.sendChat = function(room, msg) {
			if (!msg) { return; }
			var toAdd;
			if (room === 'generalChat') {
				toAdd = $scope.chatLog;
			} else {
				toAdd = $scope.tournamentChatLog
			}
			socket.emit('chat:message', {
				room: room,
				msg: msg
			});
			toAdd.push({
				msg: msg,
				user: $scope.user.user.userName
			});
		};

		$scope.$watch('chatLog.length', function(){
			//TODO make directive
			var objDiv = document.getElementById('general-chat');
			if (!objDiv) { return; }
			//next tick so it properly changes the height after the DOM is rerendered
			setTimeout(function() {
				objDiv.scrollTop = objDiv.scrollHeight;
			},0)
		});
		$scope.$watch('tournamentChatLog.length', function(){
			//TODO make directive
			var objDiv = document.getElementById('tournament-chat');
			if (!objDiv) { return; }
			//next tick so it properly changes the height after the DOM is rerendered
			setTimeout(function() {
				objDiv.scrollTop = objDiv.scrollHeight;
			},0)
		});
	});