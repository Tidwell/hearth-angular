'use strict';
angular.module('hearthApp')
	.service('user', function User(socket) {
		var user = {
			user: {
				userList: {},
				userName: '',
				password: '',
				loggedIn: false,
				error: null,
				registererror: '',
				registered: false
			}
		};

		function login() {
			user.user.error = null;
			socket.emit('user:login', {
				battleTag: user.user.userName,
				password: user.user.password
			});
		}

		function register() {
			user.user.registererror = null;
			socket.emit('user:register', {
				battleTag: user.user.userName,
				password: user.user.password
			});
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
		});

		socket.on('user:loggedIn', function(data){
			user.user.loggedIn = true;
			user.user.registered = data.registered;
			$('.hero-unit').addClass('loggedIn');
		});

		socket.on('user:loginerror', function(data){
			user.user.error = data;
		});
		socket.on('user:registererror', function(data){
			user.user.registererror = data;
		});

		socket.on('user:logout', function(data){
			delete user.user.userList[data];
		});

		socket.emit('user:list');

		return {
			get: function() {
				return user;
			},
			login: login,
			register: register,
			countUsers: countUsers
		};
	});