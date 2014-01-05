module.exports = {
	env: 'prod',
	server: {
		port: 8080
	},
	angularServer: {
		staticDirectory: '/public',
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
		dropTimeout: 240000
	},
	db: 'mongodb://localhost/hearth-angular'
};
