'use strict';

angular.module('hearthApp')
	.controller('TournamentsCtrl', function($scope, socket) {
		$scope.userList = {};
		$scope.userName = '';
		$scope.loggedIn = false;
		$scope.error;
		$scope.tournaments = null;
		$scope.activeTournament = null;
		$scope.activeBracket;
		$scope.winnerReport = '';
		$scope.match = null;
		$scope.matchError = null;

		$scope.login = function() {
			$scope.error = null;
			socket.emit('login', $scope.userName);
		};

		socket.on('user:list', function(data){
			$scope.userList = data;
		});

		socket.on('user:login', function(data){
			$scope.userList[data] = {};
			if ($scope.userName === data) {
				$scope.loggedIn = true;
			}
		});

		socket.on('user:loginerror', function(data){
			$scope.error = data;
		});

		socket.on('user:logout', function(data){
			delete $scope.userList[data];
		});

		socket.on('tournaments:list', function(data){
			$scope.tournaments = data;
		});

		socket.on('tournaments:joined', function(data){
			$scope.participant = data;
		});

		socket.on('tournaments:activeTournament', function(data){
			$scope.activeTournament = data;
			$('.active_iframe').challonge($scope.activeTournament.tournament.url, {subdomain: 'hs_tourney', theme: '1', multiplier: '1.0', match_width_multiplier: '1.0', show_final_results: '0', show_standings: '0'});
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
						console.log('clearing');
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

		$scope.isActive = function(tournament) {
			if (tournament.tournament.state === 'pending' || tournament.tournament.state === 'underway') {
				return true;
			}
			return false;
		};

		$scope.view = function(tournament) {
			$scope.activeBracket = tournament.tournament.liveImageUrl;
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
		}
	});