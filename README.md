HSTRNY website
==============

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

##Config files in ./config/ contains

To deploy:
git subtree push --prefix build origin live