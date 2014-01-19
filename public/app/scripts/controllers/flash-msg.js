'use strict';

angular.module('hearthApp')
	.controller('FlashMsgCtrl', function($scope, flashMsg) {
		$scope.flashMsg = flashMsg.get();
	});