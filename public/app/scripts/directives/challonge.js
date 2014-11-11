'use strict';

angular.module('hearthApp')
	.directive('challonge', function() {
		return {
			restrict: 'A',
			scope: {
				challonge: '='
			},
			link: function postLink(scope, element, attrs) {
				scope.$watch('challonge', update);

				function update() {
					if (scope.challonge && !angular.element(element).find('iframe').length) {
						$(element).challonge(scope.challonge, {
							//subdomain: 'nodeapitest',
							subdomain: 'hs_tourney',
							theme: '2',
							multiplier: '1.0',
							match_width_multiplier: '1.0',
							show_final_results: '0',
							show_standings: '0'
						});
					}
				}
			}
		};
	});