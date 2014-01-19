'use strict';

angular.module('hearthApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'angularLocalStorage',
	'ui.bootstrap'
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
			.when('/spectate', {
			  redirectTo: '/browse'
			})
			.when('/spectate/:id', {
			  templateUrl: 'views/spectate.html',
			  controller: 'SpectateCtrl'
			})
			.when('/play', {
				redirectTo: '/tournaments'
			})
			.when('/play/:id', {
			  templateUrl: 'views/play.html',
			  controller: 'PlayCtrl'
			})
			.when('/browse', {
			  templateUrl: 'views/browse.html',
			  controller: 'BrowseCtrl'
			})
			.when('/faq', {
			  templateUrl: 'views/faq.html',
			  controller: 'FaqCtrl'
			})
			.when('/profile', {
			  templateUrl: 'views/profile.html',
			  controller: 'ProfileCtrl'
			})
			.when('/profile/:battleTag', {
			  templateUrl: 'views/profile.html',
			  controller: 'ProfileCtrl'
			})
.when('/leaderboards', {
  templateUrl: 'views/leaderboards.html',
  controller: 'LeaderboardsCtrl'
})
			.otherwise({
				redirectTo: '/tournaments'
			});
	});