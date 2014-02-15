'use strict';

angular.module('hearthApp')
	.service('admins', function Admins() {
		var adminList = ['Tidwell#1482', 'zzyx#1198', 'Zzyx#1198', 'Noah#1105', 'noah#1105'];

		return {
			get: function() {
				return adminList;
			}
		}
	});