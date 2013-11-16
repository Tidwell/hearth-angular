'use strict';

angular.module('hearthApp')
	.service('cards', function cards($http) {
		var cards = {
			cards: []
		};

		return {
			get: function() {
				console.log('call')
				$http.get('/cards.json')
					.success(function(data) {
						cards.cards = data;
					});
				return cards;
			}
		};
	});