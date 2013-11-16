hearth-angular
==============

A very basic angular application for getting/displaying hearthstone card data/images.  Node server with multiple configs.  Starting point for hearthstone sites built with Yeoman/angular.

Requires
  * Node / NPM
  * Yeoman

Install:
  * Clone the repository
  * ```npm install``` in ./

Build:
  * ```grunt build``` in ./

Run:
  ```node app``` in ./

#CLI Arguments

**--env (-e)**
config file to load.

 Example:
```bash
  node app --env='prod.js' //run with the config from ./app/config/prod.js
```

#Config format in ./config/ contains:

```javascript
module.exports = {
	env: 'local', // string-identifier for use in custom code
	staticDirectory: './app' // ./dist in stage/production
}
```
