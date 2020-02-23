/* tslint:disable:no-var-requires */
const base = require('./base')

module.exports = {
	// base
	appId      : `${base.appId}.app`,
	packageName: base.packageName,
	appName    : base.appName,
	appVersion : base.appVersion,
	logUrl     : base.logUrl,
	installer  : base.installer,

	type  : 'prod',
	tests : {
		intern: {
			staticPort: 3014,
			serverPort: 3024,
			socketPort: 3034,
		},
	},
	sapper: {
		buildMode: 'development',
		port     : base.sapper.devServer ? 3000 : 3004,
		devServer: base.sapper.devServer,
	},
}
