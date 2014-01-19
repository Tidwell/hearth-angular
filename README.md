HSTRNY website
==============

Requires
  * Node / NPM
  * Yeoman

Install:
  * Clone the repos
  * ```git clone https://github.com/Tidwell/hearth-angular.git```
  * ```git clone https://github.com/Tidwell/node-challonge```
  * Link node-challonge for hearth-angular
  * ```cd node-challonge; npm link;
  * ```cd ../; cd hearth-angular```
  * ```npm link challonge```
  * Install hearth-angular
  * ```npm install```
  * Create config
  * mkdir server/config
  * vi server/config/local.js

```javascript
module.exports = {
  env: 'local',
  server: {
    port: 8080
  },
  angularServer: {
    staticDirectory: '/public/app',
    uriPath: '/'
  },
  socket: {
    log: false
  },
  tournaments: {
    key: 'S6e1RskMPjjQyEYFXmGu1IZ178hISWxtlVNC3yQn',
    subdomain: 'hs_tourney',
    regions: ['NA', 'EU'],
    regionPrefix: '[',
    regionSuffix: ']',
    namePrefix: '8 Player Tournament ',
    dropTimeout: 60000
  },
  db: 'mongodb://localhost/hearth-angular'
};
```

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