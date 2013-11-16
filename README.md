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
  * ```node app``` in ./

View:
	```http://localhost:8080```

##CLI Arguments

**--env (-e)**
  config file to load.
  ```
    node app --env=prod //run with the config from ./app/config/prod.js
  ```

##Config files in ./config/ contains:

```javascript
module.exports = {
	env: 'local', // string-identifier for use in custom code
	staticDirectory: './app', // ./dist in stage/production
	port: 8080
}
```
