hearth-angular
==============

Requires:
  Node / NPM
  Git

By default, running:
  node app

In the project directory will include the ./configs/local.js config

Passing --env (or -e) will all you to specify a specific config to load.

Config options include:

module.exports = {
	env: 'string-identifier',
	staticDirectory: './directory/to/grunt/built/files/'
}
