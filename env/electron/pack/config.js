/* eslint-disable no-template-curly-in-string,no-process-env */
// docs: https://www.electron.build/configuration/configuration#build

if (!process.env.APP_CONFIG) {
	console.error('Environment variable APP_CONFIG is not defined', __filename)
	throw new Error('Environment variable APP_CONFIG is not defined')
}

const appConfig = require(`../../../configs/${process.env.APP_CONFIG}`)

module.exports = {
	appId      : appConfig.appId,
	productName: appConfig.appName,
	copyright  : 'Copyrights © 2020 App Template. All rights reserved.',
	directories: {
		buildResources: '.',
		output        : `dist/${process.env.APP_CONFIG}/electron/pack`,
	},
	files: [
		`dist/${process.env.APP_CONFIG}/sapper/export/**`,
		`dist/${process.env.APP_CONFIG}/electron/build/**`,
	],
	extraFiles   : ['static/favicon*.*'],
	extraMetadata: {
		name: appConfig.packageName,
		main: `dist/${process.env.APP_CONFIG}/electron/build/index.js`,
	},
	win: {
		target                : 'msi',
		icon                  : 'appicon.ico',
		legalTrademarks       : 'App Template',
		signDlls              : false,
		// see list of servers here: https://gist.github.com/Manouchehri/fd754e402d98430243455713efada710
		rfc3161TimeStampServer: 'http://sha256timestamp.ws.symantec.com/sha256/timestamp',
		// rfc3161TimeStampServer: 'http://timestamp.globalsign.com/scripts/timstamp.dll',
		extraFiles            : [
			
		],
	},
	mac: {
		target    : 'dmg',
		icon      : 'appicon.icns',
		// "background": "res/background.png",
		// see: https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8
		category  : 'public.app-category.business',
		// extraFiles: [
		// 	`dist/${process.env.APP_CONFIG}/electron/build/pkg-scripts`,
		// ],
	},
	dmg: {

	},

	// pkg: {
	// !!! postinstall is not worked !!!
	// 	// see example: https://github.com/astaupb/copyclient_electron/blob/0f4b1a94da549cb1e9fcaf791707a4037a0cac8b/package.json
	// 	scripts: `dist/${process.env.APP_CONFIG}/electron/build/pkg-scripts`,
	// 	// installLocation: '/Applications',
	// 	// allowAnywhere       : true,
	// 	// allowCurrentUserHome: true,
	// 	// allowRootDirectory  : true,
	// },

	npmRebuild     : false,
	electronVersion: appConfig.installer.electronVersion,
	nodeVersion    : appConfig.installer.nodeVersion,

	// check sign package:
	// readonly        : true,
	// forceCodeSigning: true,

	artifactName: `${appConfig.appName} ${appConfig.appVersion}.\${ext}`,
	compression : 'maximum', // store | normal | maximum
}
