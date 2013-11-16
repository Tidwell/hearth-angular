hearth-angular
==============

Requires
  * Node / NPM
  * Yeoman

Install:
  Clone the repository
  npm install in repository directory

Run:
  node app

#CLI Arguments

**--env (-e)**
config file to load.

 Example:
```bash
  node app --env='prod.js' //run with the config from ./app/config/prod.js
```

#Config files in config/ should contain:

```javascript
module.exports = {
	env: 'local', // string-identifier for use in custom code
	staticDirectory: './app' // ./dist in stage/production
}
```
