module.exports = {
        "env": "local",
        "server": {
                "port": 8080
        },
        "angularServer": {
                "staticDirectory": "/public/app",
                "uriPath": "/"
        },
        "socket": {
                "log": false
        },
        "tournaments": {
                "key": "S6e1RskMPjjQyEYFXmGu1IZ178hISWxtlVNC3yQn",
                "subdomain": "nodeapitest",
                "regions": ["NA", "EU"],
                "regionPrefix": "[",
                "regionSuffix": "]",
                "namePrefix": "8 Player Tournament ",
                "dropTimeout": 60000
        },
        "db": "mongodb://localhost/hearth-angular"
};

