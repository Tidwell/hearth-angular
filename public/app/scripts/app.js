'use strict';

angular.module('hearthApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'angularLocalStorage',
	'ngAnimate'
])
	.config(function($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$routeProvider
			.when('/main', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.when('/owned', {
				templateUrl: 'views/owned.html',
				controller: 'OwnedCtrl'
			})
			.when('/links', {
			  templateUrl: 'views/links.html',
			  controller: 'LinksCtrl'
			})
			.when('/tournaments', {
			  templateUrl: 'views/tournaments.html',
			  controller: 'TournamentsCtrl'
			})
			.otherwise({
				redirectTo: '/tournaments'
			});
	});