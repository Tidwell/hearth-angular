'use strict';

(function() {
	var socket = io.connect('http://localhost:8080');

	angular.module('hearthApp')
		.service('socket', function Socket($rootScope) {
			return {
				on: function(eventName, callback) {
					socket.on(eventName, function() {
						var args = arguments;
						$rootScope.$apply(function() {
							callback.apply(socket, args);
						});
					});
				},
				emit: function(eventName, data, callback) {
					socket.emit(eventName, data, function() {
						var args = arguments;
						$rootScope.$apply(function() {
							if (callback) {
								callback.apply(socket, args);
							}
						});
					})
				}
			};
		});
}());