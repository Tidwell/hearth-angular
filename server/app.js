'use strict';

var path = require('path');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

var moduleDirectory = '/server/app/';

var modules = [];

//resolve the path to the module directory
var absolutePath = path.resolve(path.normalize(process.cwd()+moduleDirectory));

/*
	Synchronously figure out the modules to load.
	Done once at bootstrap.

	POTENTIAL BOTTLENECK
*/
function compileModules(path) {
	var files = fs.readdirSync(path);
	files.forEach(function(file) {
		if (file.indexOf('.js') !== -1) {
			//if it is a .js file, it is a module to load
			modules.push({
				path: path + '/' + file,
				name: file.replace('.js', '').replace(file[0], file[0].toUpperCase())
			});
		} else {
			//otherwise we recurse
			compileModules(absolutePath+'/'+file);
		}
	});
}
compileModules(absolutePath);

//after we know all the modules, add them to the exports so the user can access them
modules.forEach(function forEach(part) {
	var module = part.name;
	exports[module] = require(part.path)[module];
});

/*
	exposes: createServer

	Emits:
		modules:loaded - server has been created
*/
exports.createServer = function(options) {
	var server = {
		modules: {},
		options: options,
		events: new EventEmitter()
	};

	//require each module in ./app/ and create new instance of each, passing opts
	modules.forEach(function generate(part) {
		var k = part.name;
		var module = k.toLowerCase();
		// store for user access via serverInstance.modules
		server.modules[module] = new exports[k](server.options, server.events);
	});

	server.events.emit('modules:loaded');

	return server;
};