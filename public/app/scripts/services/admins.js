'use strict';

angular.module('hearthApp')
	.service('admins', function Admins() {
		var adminList = ['Tidwell#1482', 'zzyx#1198', 'Zzyx#1198'];

		return {
			get: function() {
				return adminList;
			}
		}
	});