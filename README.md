HSTRNY website
==============

Requires
  * Node / NPM
  * Yeoman

Install:
  * Clone the repository
  * ```git clone https://github.com/Tidwell/hearth-angular.git```
  * ```npm install``` in ./

Build:
  * ```./build.sh``` in ./

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

##Deploy

  * ./build.sh
  * ```git subtree push --prefix build origin live```
  * ssh into box
  * ```git pull```

If server needs restart:
  * Look for the process on port 9007 using: netstat -tulpn
  * kill #PID
  * nohup node app -env=prod &
  * sudo service apache2 restart

Bug Tracking:
  * http://hstrny.idea.informer.com/