hearth-angular
==============

Requires:
  Node / NPM
  Yeoman

To install:
  clone the repository
  npm install

To run:
  node app

**CLI Arguments**

--env (or -e) - config file to load.

Example:
```bash
  node app --env='prod.js' //run with the config from ./app/config/prod.js
```

Config files in config/ should contain:

```javascript
module.exports = {
	env: 'local', // string-identifier for use in custom code
	staticDirectory: './app' // ./dist in stage/production
}
```
