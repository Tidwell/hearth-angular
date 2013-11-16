'use strict';

angular.module('hearthApp')
	.service('cards', function cards($http) {
		var cardList = {
			cards: []
		};

		return {
			get: function() {
				$http.get('/cards.json')
					.success(function(data) {
						cardList.cards = data;
					});
				return cardList;
			}
		};
	});