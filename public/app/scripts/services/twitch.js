'use strict';

/**
 * @ngdoc service
 * @name hearthApp.TwitchStreams
 * @description
 * # TwitchStreams
 * Service in the hearthApp.
 */
angular.module('hearthApp')
	.service('TwitchStreams', function TwitchStreams($q, $rootScope) {
		var Twitch = window.Twitch;
		var channel = 'xenocide_hs';
		var channel = 'HSdogdog';
		var phrase = 'Online Tournament';
		var phrase = '';

		function get(cb) {
			var twitch = {
				active: false
			};
			Twitch.init({
				clientId: 'spvz0dtwvb2yh7ap7balpdozi5jooh8'
			}, function() {
				Twitch.api({
					method: 'streams',
					params: {
						channel: channel,
						limit: 3
					}
				}, function(error, list) {
					if (!list.streams.length) { return $rootScope.$apply(); }
					var stream = list.streams[0];
					if (stream.channel.status.indexOf(phrase) > -1) {
						twitch.active = true;
						twitch.url = stream.channel.url;
						twitch.logo = stream.channel.logo;
						twitch.status = stream.channel.status;
						twitch.displayName = stream.channel.display_name;
					}
					$rootScope.$apply();
					if (cb) { cb(twitch); }
				});
			});

			return twitch;
		}

		function refresh() {
			var deferred = $q.defer();
			function cb(data) {
				deferred.resolve(data);
			}
			get(cb);
			return deferred.promise;
		}

		return {
			get: get,
			refresh: refresh
		};
	});