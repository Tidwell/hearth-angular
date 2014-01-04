'use strict';

angular.module('hearthApp')
	.service('activeTournament', function ActiveTournament(socket) {
		var at = {
			activeTournament: null,
			winnerReport: '',
			match: null,
			matchError: null,
			participant: null,
			idNameMap: {}
		};

		function updateMatch() {
			at.activeTournament.tournament.participants.forEach(function(p) {
				at.idNameMap[p.participant.id] = p.participant.name;
			});
			var pid = at.participant.participant.id;
			var activeMatch = false;
			at.activeTournament.tournament.matches.forEach(function(match){
				if (match.match.state === 'open' && (match.match.player1Id === pid || match.match.player2Id === pid)) {
					if (at.match && match.match.round !== at.match.match.round) {
						at.matchError = null;
						at.winnerReport = '';
					}
					at.match = match;
					at.match.player1Name = at.idNameMap[match.match.player1Id];
					at.match.player2Name = at.idNameMap[match.match.player2Id];
					activeMatch = true;
				}
			});
			if (!activeMatch) {
				at.match = null;
			}
		}

		socket.on('tournaments:dropped', function(){
			at.activeTournament = null;
			at.participant = null;
		});

		socket.on('tournaments:eliminated', function(){
			at.activeTournament = null;
			at.participant = null;
		});

		socket.on('tournaments:won', function(){ //end of tournament, player won
			at.activeTournament = null;
			at.participant = null;
		});

		socket.on('tournaments:joined', function(data){
			at.participant = data;
		});

		socket.on('tournaments:activeTournament', function(data){
			at.activeTournament = data;
			updateMatch();
			if (at.activeTournament.tournament.state === 'complete') {
				at.activeTournament = null;
			}
		});

		socket.on('tournaments:winnerConflict', function(data){
			if (!at.match) { return; }
			if (at.match.match.id === data.matchId) {
				at.matchError = data;
			}
		});

		function join(tournament) {
			socket.emit('tournaments:join', tournament.tournament.url);
		}

		function drop() {
			socket.emit('tournaments:drop', at.activeTournament.tournament.url);
		}

		function sendResult() {
			socket.emit('tournaments:report', {
				tournamentId: at.activeTournament.tournament.url,
				matchId: at.match.match.id,
				winnerId: at.winnerReport
			});
		}

		return {
			get: function() { return at; },
			join: join,
			drop: drop,
			sendResult: sendResult
		};
	});