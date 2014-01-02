/*
	Depends on: Module, Server

	SERVER EVENTS
	Emits:
		tournaments:reconnect - when a player reconnects
	Subscribes:
		socket:ready - loads tournaments from challonge
		socket:connection - emits list and listens for events from the client
		loggedInUsers:loggedIn - does reconnect behavior

	SOCKET EVENTS (to the client)
	Emits:
		tournaments:list - list of all tournaments
		tournaments:joined - successfull join
		tournaments:dropped - sucessfull drop
		tournaments:activeTournament - updates a single user with their active tournament
		tournaments:winnerConflict - reporting conflict between players
	Subscribes:
		tournaments:join - join request
		tournaments:drop - drop request

*/
var util = require('util');

var challonge = require('challonge');

var Module = require('./core/module').Module;

var Tournaments = exports.Tournaments = function(options, events) {
	//call parent constructor
	Module.call(this, options);
	var self = this;

	self.events = events;

	var tournamentsOptions = self.options.get('tournaments');

	self.challongeClient = challonge.createClient({
		apiKey: tournamentsOptions.key,
		format: 'json',
		version: 1,
		subdomain: tournamentsOptions.subdomain
	});

	self.tournaments = [];
	self.lastTourney = 0;

	self.fullTournaments = {};

	events.on('socket:ready', function(sServer){
		self.socketServer = sServer;
		self.loadTournaments();
	});
	events.on('socket:connection', function(socket){
		socket.emit('tournaments:list', self.tournaments);

		socket.on('tournaments:list', function(){
			socket.emit('tournaments:list', self.tournaments);
		});

		socket.on('tournaments:join', function(tournamentId){
			socket.get('userName', function(err,name){
				self.joinTournament(tournamentId, name, socket);
			});
		});

		socket.on('tournaments:drop', function(tournamentId){
			socket.get('participant', function(err,p){
				self.dropTournament(tournamentId, p.participant.id, socket);
			});
		});

		socket.on('tournaments:report', function(obj){
			self.report(obj, socket);
		});

		socket.on('tournaments:info', function(id){
			if (self.fullTournaments[id]) {
				socket.emit('tournaments:info', self.fullTournaments[id]);
			} else {
				socket.emit('tournaments:info', {error: 'No Tournament Found.'})
			}
		});
	});

	//reconnect
	events.on('loggedInUsers:loggedIn', function(socket){
		socket.get('userName', function(err,name){
			for (var url in self.fullTournaments){
				var tournament = self.fullTournaments[url].tournament;
				if (tournament.state === 'underway' || tournament.state === 'pending') {
					tournament.participants.forEach(function(participant){
						if (participant.participant.name === name) {
							participant.participant.tournamentUrl = url;
							socket.set('participant', participant);
							socket.emit('tournaments:joined', participant);
							events.emit('tournaments:reconnect', {
								socket: socket,
								tournamentId: url
							});
							self.updateSocketTournament(url);
						}
					});
				}
			}
		});
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
				self.loadTournaments();
				self.socketServer.sockets.in('generalChat').emit('chat:message', {
					room: 'generalChat',
					user: 'System',
					msg: 'A new tournament has been created: '+tourneyName
				});
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
};

Tournaments.prototype.checkFinalize = function() {
	var self = this;
	self.tournaments.forEach(function(tourney) {
		if (tourney.tournament.state === 'awaiting_review') {
			self.challongeClient.tournaments.finalize({
				id: tourney.tournament.url,
				callback: function(err,data){
					if (err) { console.log(err); return; }
					self.loadTournaments();
					self.updateSocketTournament(tourney.tournament.url);
				}
			});
		}
	});
};

Tournaments.prototype.updateSocketTournament = function(id) {
	var self = this;
	self.challongeClient.tournaments.show({
		includeParticipants: 1,
		includeMatches: 1,
		id: id,
		callback: function(err,data){
			if (err) { console.log(err); return; }
			self.fullTournaments[id] = data; //cache it
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
			self.checkFinalize();

			//get full data for active tournaments on first call
			self.tournaments.forEach(function(tournament){
				var t = tournament.tournament;
				if (t.state === 'underway' || t.state === 'pending' && !self.fullTournaments[t.url]) {
					self.updateSocketTournament(t.url);
				}
			});
		}
	});
};

Tournaments.prototype.joinTournament = function(id, name, socket){
	var self = this;

	//TODO get participant, if exists (already in tournament) refuse join


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
			self.events.emit('tournaments:connect', {
				socket: socket,
				tournamentId: id
			});
			self.loadTournaments();
			self.updateSocketTournament(data.participant.tournamentUrl);
		}
	});
};

Tournaments.prototype.dropTournament = function(id, pid, socket) {
	var self = this;
	self.challongeClient.participants.destroy({
		id: id,
		participantId: pid,
		callback: function(err,data){
			if (err) { console.log(err); return; }
			socket.emit('tournaments:dropped', data);
			socket.set('participant', null);
			self.loadTournaments();
			self.updateSocketTournament(id);
		}
	});
};

var activeReports = {};

Tournaments.prototype.report = function(obj, socket) {
	var self = this;
	socket.get('participant', function(err,participant){
		if (!participant) { return; } //do nothing if they arent in a tourney
		if (!activeReports[obj.tournamentId]) {
			activeReports[obj.tournamentId] = {};
		}
		
		if (!activeReports[obj.tournamentId][obj.matchId]) {
			activeReports[obj.tournamentId][obj.matchId] = [];
		}
		var match = activeReports[obj.tournamentId][obj.matchId];
		if (match.length) {
			match.forEach(function(report, i){
				if (report.user === participant.participant.id) {
					match.splice(i,1);
				}
			});
		}
		match.push({
			user: participant.participant.id,
			winner: obj.winnerId
		});

		if (match.length === 2) {
			if (match[0].winner === match[1].winner) {
				self.challongeClient.matches.update({
					id: obj.tournamentId,
					matchId: obj.matchId,
					match: {
						scoresCsv: '3-0',
						winnerId: match[0].winner
					},
					callback: function(err,data){
						if (err) { console.log(err); return; }

						self.loadTournaments();
						self.updateSocketTournament(obj.tournamentId);

						delete activeReports[obj.tournamentId][obj.matchId];
					}
				});
			} else {
				self.socketServer.sockets.emit('tournaments:winnerConflict', {
					id: obj.tournamentId,
					matchId: obj.matchId,
					report: match
				});
				self.socketServer.sockets.in(obj.tournamentId).emit('chat:message', {
					room: obj.tournamentId,
					user: 'System',
					msg: 'A reporting conflict has been detected.'
				});
			}
		}
	});
};