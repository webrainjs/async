/* tslint:disable:no-var-requires */
const base = require('./base')

module.exports = {
	// base
	appId      : `${base.appId}.dev`,
	packageName: `${base.packageName}-dev`,
	appName    : `${base.appName} Dev`,
	appVersion : `${base.appVersion}`,
	logUrl     : base.logUrl,
	installer  : base.installer,

	type  : 'dev',
	dev   : {
		devTools: {
			openAtStart: false,
		},
	},
	tests: {
		intern: {
			serverIp  : base.tests.intern.serverIp,
			staticPort: 3012,
			serverPort: 3022,
			socketPort: 3032,
		},
	},
	sapper: {
		buildMode: 'development',
		port     : base.sapper.devServer ? 3000 : 3002,
		devServer: base.sapper.devServer,
	},
}
