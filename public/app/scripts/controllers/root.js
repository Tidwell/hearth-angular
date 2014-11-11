'use strict';

/**
 * @ngdoc function
 * @name hearthApp.controller:RootCtrl
 * @description
 * # RootCtrl
 * Controller of the hearthApp
 */
angular.module('hearthApp')
	.controller('RootCtrl', function($scope, socket) {
		$scope.connectionStatus = 'disconnected';
		socket.on('reconnecting', function() {
			$scope.connectionStatus = 'reconnecting';
		});
		socket.on('connect', function() {
			$scope.connectionStatus = 'connected';
		});
		socket.on('loggedIn', function() {
			$scope.connectionStatus = 'connected';
		});
		socket.on('tournaments:list', function() {
			$scope.connectionStatus = 'connected';
		});
		
	});