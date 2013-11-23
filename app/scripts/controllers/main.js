'use strict';

angular.module('hearthApp')
	.controller('MainCtrl', function($scope, cards) {
		$scope.cardWidth = 235;
		$scope.cardList = cards.get();
	});