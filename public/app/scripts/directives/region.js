'use strict';

angular.module('hearthApp')
	.directive('region', function() {
		return {
			template: '<span></span>',
			link: function postLink(scope, element, attrs) {
				if (attrs.region.indexOf('[NA]') !== -1) {
					element.text('North American');
				} else {
					element.text('European');
				}
			}
		};
	});