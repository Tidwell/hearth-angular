'use strict';

angular.module('hearthApp')
	.service('owned', function owned(storage) {
		var owned = {
			//get from local storage or default to empty object
			cards: storage.get('cards') || {}
		};

		//saves to local storage
		function save() {
			storage.set('cards', owned.cards);
		}

		//resets to default and saves
		function clear() {
			owned.cards = {};
			save();
		}

		return {
			get: function() {
				return owned;
			},
			save: save,
			clear: clear
		};
	});