/*
	Depends on: Module, Server

	Subscribes:
		socket:ready - adds socketio
*/
var util = require('util');

var challonge = require('challonge');

var Module = require('./core/module').Module;

var Tournaments = exports.Tournaments = function(options, events) {
	//call parent constructor
	Module.call(this, options);
	var self = this;

	var tournamentsOptions = self.options.get('tournaments');

	self.challongeClient = challonge.createClient({
		apiKey: tournamentsOptions.key,
		format: 'json',
		version: 1,
		subdomain: tournamentsOptions.subdomain
	});

	self.tournaments = [];
	self.lastTourney = 0;

	events.on('socket:ready', function(sServer){
		self.socketServer = sServer;
		self.loadTournaments();
	});
	events.on('socket:connection', function(socket){
		socket.emit('tournaments:list', self.tournaments);

		socket.on('tournaments:join', function(tournamentId){
			socket.get('userName', function(err,name){
				self.joinTournament(tournamentId, name, socket);
			});
		});
	});

	events.on('loggedInUsers:loggedIn', function(socket){

	});
};

util.inherits(Tournaments, Module);

Tournaments.prototype.checkCreate = function() {
	var self = this;

	var isWaiting = false;
	self.tournaments.forEach(function(tourney) {
		if (tourney.tournament.state === 'pending') {
			isWaiting = true;
		}
	});

	if (!isWaiting) {
		var tourneyName = 'Pickup 8-man tournament '+(++self.lastTourney);
		self.challongeClient.tournaments.create({
			tournament: {
				name: tourneyName,
				url: tourneyName.replace(/\W/g, ''),
				signupCap: 8,
				tournamentType: 'single elimination',
			},
			callback: function(err,data){
				if (err) { console.log(err); return; }
				console.log('created');
				self.loadTournaments();
			}
		});
	}
};

Tournaments.prototype.checkStart = function() {
	var self = this;
	self.tournaments.forEach(function(tourney) {
		if (tourney.tournament.state === 'pending' && tourney.tournament.participantsCount === tourney.tournament.signupCap) {
			self.challongeClient.participants.randomize({
				id: tourney.tournament.url,
				callback: function(err,data){
					if (err) { console.log('err', err); return; }
					self.challongeClient.tournaments.start({
						id: tourney.tournament.url,
						callback: function(err,data){
							if (err) { console.log(err); return; }
							self.loadTournaments();
							self.updateSocketTournament(tourney.tournament.url);
						}
					});
				}
			});
		}
	});	
}

Tournaments.prototype.updateSocketTournament = function(id) {
	var self = this;
	self.challongeClient.tournaments.show({
		includeParticipants: 1,
		includeMatches: 1,
		id: id,
		callback: function(err,data){
			if (err) { console.log(err); return; }
			self.socketServer.sockets.clients().forEach(function(socket){
				socket.get('participant', function(err,participant){
					if (participant && participant.participant.tournamentUrl === id) {
						socket.emit('tournaments:activeTournament', data);
						socket.set('tournament', data);
					}
				});
			});
		}
	});
};

Tournaments.prototype.loadTournaments = function() {
	var self = this;
	self.challongeClient.tournaments.index({
		callback: function(err,data){
			if (err) { console.log(err); return; }
			self.tournaments = data;
			self.lastTourney = data.length;
			self.socketServer.sockets.emit('tournaments:list', self.tournaments);
			self.checkCreate();
			self.checkStart();
		}
	});
};

Tournaments.prototype.joinTournament = function(id, name, socket){
	var self = this;
	self.challongeClient.participants.create({
		id: id,
		participant: {
			name: name
		},
		callback: function(err,data){
			if (err) { console.log(err); return; }
			data.participant.tournamentUrl = id;
			socket.set('participant', data);
			socket.emit('tournaments:joined', data);
			self.loadTournaments();
			self.updateSocketTournament(data.participant.tournamentUrl);
		}
	});
};