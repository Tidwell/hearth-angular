'use strict';

angular.module('hearthApp')
	.service('admins', function Admins() {
		var adminList = [
			'Tidwell#1482',
			'zzyx#1198',
			'Zzyx#1198',
			'Noah#1105',
			'noah#1105',
			'CookMySock#2517',
			'cookMySock#2517',
			'bakazero#2330',
			'Bakazero#2330',
			'likkyzero#1227',
			'Likkyzero#1227',
			'Zhulander#1652',
			'mightypants7#1310',
			'Zeus#2680',
			'Violentce#1391'
		];

		return {
			get: function() {
				return adminList;
			}
		}
	});