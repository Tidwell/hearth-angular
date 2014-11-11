'use strict';
angular.module('hearthApp')
	.service('user', function User(socket, $cookies) {
		var defaultUser = {
			userList: {},
			userName: '',
			password: '',
			loggedIn: false,
			error: null,
			registererror: '',
			registered: false
		};
		var user = {
			user: angular.copy(defaultUser)
		};

		function login() {
			user.user.error = null;
			socket.emit('user:login', {
				battleTag: user.user.userName,
				password: user.user.password
			});
		}

		function logout() {
			user.user.error = null;
			user.user = angular.copy(defaultUser);
			$cookies.hstbattleTag = '';
			$cookies.hstpw = '';
			socket.emit('user:logout');
			$('.hero-unit').removeClass('loggedIn');
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
			$cookies.hstbattleTag = user.user.userName;
			$cookies.hstpw = user.user.password;
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

		socket.on('reconnect', function(){
			login();
		});

		if ($cookies.hstbattleTag) {
			user.user.userName = $cookies.hstbattleTag;
			user.user.password = $cookies.hstpw || '';
			login();
		}

		return {
			get: function() {
				return user;
			},
			login: login,
			logout: logout,
			register: register,
			countUsers: countUsers
		};
	});