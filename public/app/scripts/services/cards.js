'use strict';

angular.module('hearthApp')
	.service('cards', function cards($http) {
		var cardList = {
			cards: []
		};

		/* methods */
		/* 
			realCard

			checks to ensure a card isnt a token or hero

			@argument card obj
				obj.collectible Boolean - if the card is collectible
				obj.type String - the type of card (hero, spell, weapon, etc...)

			@returns Boolean - if the card is a real card (true) or a token/hero (false)
		*/
		function realCard(card) {
			return card.collectible && card.type !== 'hero';
		}

		return {
			get: function() {
				$http.get('/cards.json')
					.success(function(data) {
						cardList.cards = data;
					});
				return cardList;
			},
			realCard: realCard
		};
	});