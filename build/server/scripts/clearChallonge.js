/*
var challonge = require('challonge');

var opts = require('../config/local');

var client = challonge.createClient({
	apiKey: opts.tournaments.key,
	format: 'json',
	version: 1,
	subdomain: opts.tournaments.subdomain
});

client.tournaments.index({
	callback: function(err,data){
		if (err) { console.log(err); return; }
		data.forEach(function(tourney){
			console.log(tourney.tournament.url);

			client.tournaments.destroy({
				id: tourney.tournament.url,
				callback: function(err,data){
					if (err) { console.log(err); return; }
					console.log('destroyed', tourney.tournament.url);
				}
			});
		})
	}
});
*/