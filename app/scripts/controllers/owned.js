'use strict';

angular.module('hearthApp')
	.controller('OwnedCtrl', function($scope, cards, owned) {
		/* data */
		$scope.cardList = cards.get();
		$scope.owned = owned.get();

		/* funcs */
		$scope.realCard = cards.realCard;
		$scope.clearData = owned.clear;

		/* sorting */
		$scope.order = 'name';
		$scope.reverseSort = false;

		/* methods */
		/* 
			@method updateOwned

			updates the owned service with a new number from the UI, then tells the service to persist

			@arg card obj
				obj.id Number - the card id to update
				obj.owned Number - the number owned
		*/
		$scope.updateOwned = function(card) {
			if (card && card.id && card.owned) {
				$scope.owned.cards[card.id] = card.owned;
			}
			owned.save();
		};

		/* 
			@method ownAll

			updates the owned service with the maximum for each card (1 for legendary, 2 for everythign else)
		*/
		$scope.ownAll = function() {
			$scope.cardList.cards.forEach(function(card) {
				if ($scope.realCard(card)) {
					$scope.updateOwned({
						id: card.id,
						//max of 1 legendary, 2 of everything else
						owned: (card.quality === 'legendary' ? 1 : 2)
					});
				}
			});
		};
	});