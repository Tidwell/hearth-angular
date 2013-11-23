'use strict';

angular.module('hearthApp')
	.service('owned', function owned(storage) {
		var ownedCards = {
			//get from local storage or default to empty object
			cards: storage.get('cards') || {}
		};

		//saves to local storage
		function save() {
			storage.set('cards', ownedCards.cards);
		}

		//resets to default and saves
		function clear() {
			ownedCards.cards = {};
			save();
		}

		return {
			get: function() {
				return ownedCards;
			},
			save: save,
			clear: clear
		};
	});