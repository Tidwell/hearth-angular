'use strict';

angular.module('hearthApp')
	.controller('MainCtrl', function($scope, cards) {
		$scope.cardWidth = 200;
		$scope.cardList = cards.get();
	});