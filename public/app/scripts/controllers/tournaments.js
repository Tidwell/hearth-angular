'use strict';

angular.module('hearthApp')
	.controller('TournamentsCtrl', function($scope, socket) {
		$scope.userList = {};
		$scope.userName = '';
		$scope.loggedIn = false;
		$scope.error;
		$scope.tournaments = null;

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
	});