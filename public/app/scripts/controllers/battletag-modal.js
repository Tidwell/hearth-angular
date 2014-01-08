'use strict';

angular.module('hearthApp')
	.controller('BattletagModalCtrl', function BattletagModalCtrl($scope, dialog) {
		$scope.close = function() { dialog.close() };
	});