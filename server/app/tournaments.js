/*
	Depends on: Module, Server

	Subscribes:
		socket:ready - adds socketio
*/
var util = require('util');
var path = require('path');
var fs = require('fs');
var express = require('express');
var io = require('socket.io');

var Module = require('./core/module').Module;

var Tournaments = exports.Tournaments = function(options, events) {
	//call parent constructor
	Module.call(this, options);
	var self = this;

	var TournamentsOptions = self.options.get('tournaments');

	self.tournaments = [];
	self.lastTourney = 0;

	events.on('socket:ready', function(sServer){
		self.socketServer = sServer;
		self.checkCreate();
	});
	events.on('socket:connection', function(socket){
		socket.emit('tournaments:list', self.tournaments);
	});
};

util.inherits(Tournaments, Module);

Tournaments.prototype.checkCreate = function() {
	var self = this;

	var isWaiting = false;
	self.tournaments.forEach(function(tourney) {
		if (tourney.started === false) {
			isWaiting = true;
		}
	});

	if (!isWaiting) {
		console.log('creating Tournament');
		self.tournaments.push({
			started: false,
			name: 'Pickup 8-man tournament '+(++self.lastTourney),
			rules: 'Standard',
			players: 0,
			maxPlayers: 8
		});
		self.socketServer.sockets.emit('tournaments:list', self.tournaments);	
	}
}