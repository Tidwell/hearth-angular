'use strict';
angular.module('hearthApp')
	.service('user', function User(socket) {
		var user = {
			user: {
				userList: {},
				userName: '',
				loggedIn: false,
				error: null
			}
		};

		function login() {
			user.user.error = null;
			socket.emit('login', user.user.userName);
		}

		function countUsers() {
			var c = 0;
			for (var name in user.user.userList) {
				c++;
			}
			return c;

		}

		socket.on('user:list', function(data){
			user.user.userList = data;
		});

		socket.on('user:login', function(data){
			user.user.userList[data] = {};
			if (user.user.userName === data) {
				user.user.loggedIn = true;
				$('.hero-unit').addClass('loggedIn');
			}
		});

		socket.on('user:loginerror', function(data){
			user.user.error = data;
		});

		socket.on('user:logout', function(data){
			delete user.user.userList[data];
		});

		return {
			get: function() {
				return user;
			},
			login: login,
			countUsers: countUsers
		};
	});