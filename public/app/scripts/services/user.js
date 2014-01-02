'use strict';
angular.module('hearthApp')
	.service('user', function User(socket) {
		var user = {
			userList: {},
			userName: '',
			loggedIn: false,
			error: null,
		};

		function login() {
			user.error = null;
			socket.emit('login', user.userName);
		}

		function countUsers() {
			var c = 0;
			for (var name in user.userList) {
				c++;
			}
			return c;
		}

		socket.on('user:list', function(data){
			user.userList = data;
		});

		socket.on('user:login', function(data){
			user.userList[data] = {};
			if (user.userName === data) {
				user.loggedIn = true;
				$('.hero-unit').addClass('loggedIn');
			}
		});

		socket.on('user:loginerror', function(data){
			user.error = data;
		});

		socket.on('user:logout', function(data){
			delete user.userList[data];
		});

		return {
			get: function() {
				return user;
			},
			login: login,
			countUsers: countUsers
		};
	});