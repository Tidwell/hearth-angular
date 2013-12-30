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
			var url = $scope.activeTournament.tournament.liveImageUrl;
			refreshUrl(url);
		});

		var refreshInterval;
		function refreshUrl(url) {
			clearInterval(refreshInterval);
			refreshInterval = setInterval(function(){
				$scope.activeTournament.tournament.liveImageUrl = '';
				$scope.$apply();
				$scope.activeTournament.tournament.liveImageUrl = url;
				$scope.$apply();
			}, 30000);
		}

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
	});