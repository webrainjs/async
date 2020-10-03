/* eslint-disable no-template-curly-in-string,no-process-env */
// docs: https://www.electron.build/configuration/configuration#build
const {macNotarize} = require('./mac/notarize')

if (!process.env.APP_CONFIG) {
	console.error('Environment variable APP_CONFIG is not defined', __filename)
	throw new Error('Environment variable APP_CONFIG is not defined')
}

const appConfig = require(`../../../configs/${process.env.APP_CONFIG}`)

console.log(`DEBUG_PACK = "${process.env.DEBUG_PACK}"`)

module.exports = {
	appId       : appConfig.appId,
	productName : appConfig.appName,
	buildVersion: Math.floor(new Date() / 60000).toString(),
	copyright   : 'Copyrights © 2020 App Template. All rights reserved.',
	directories : {
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
		// target                : 'appx',
		// target                : 'nsis',
		// target                : 'msi',
		target                : 'portable',
		icon                  : 'appicon.ico',
		legalTrademarks       : appConfig.appName,
		signDlls              : false,
		// see list of servers here: https://gist.github.com/Manouchehri/fd754e402d98430243455713efada710
		rfc3161TimeStampServer: 'http://sha256timestamp.ws.symantec.com/sha256/timestamp',
		// rfc3161TimeStampServer: 'http://timestamp.globalsign.com/scripts/timstamp.dll',
		extraFiles            : [
			
		],
	},
	mac: {
		target: appConfig.pack.mac.type === 'mas' && process.env.DEBUG_PACK
			? 'mas-dev'
			: appConfig.pack.mac.type,
		icon               : 'appicon.icns',
		// "background": "res/background.png",
		// see: https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8
		category           : 'public.app-category.business',
		hardenedRuntime    : true,
		gatekeeperAssess   : false,
		entitlements       : 'env/app-store/mac/entitlements.mac.plist',
		entitlementsInherit: 'env/app-store/mac/entitlements.mac.plist',
		// extraFiles: [
		// 	`dist/${process.env.APP_CONFIG}/electron/build/pkg-scripts`,
		// ],
	},

	// issues: https://github.com/electron-userland/electron-builder/issues/3989#issuecomment-643976553
	mas: {
		hardenedRuntime    : false,
		entitlements       : 'env/app-store/mac/entitlements.mas.plist',
		entitlementsInherit: 'env/app-store/mac/entitlements.mas.inherit.plist',
		provisioningProfile: appConfig.pack.mac.type === 'mas-dev' || process.env.DEBUG_PACK
			? 'env/app-store/mac/dev.provisionprofile'
			: 'env/app-store/mac/prod.provisionprofile',
	},
	dmg: {

	},
	afterSign: async context => {
		const {electronPlatformName} = context
		console.log(`electronPlatformName=${ electronPlatformName}`)
		if (!process.env.DEBUG_PACK && appConfig.pack.mac.notarize && electronPlatformName === 'darwin') {
			await macNotarize()
		}
	},
	pkg: {
	// !!! postinstall is not worked !!!
		// see example: https://github.com/astaupb/copyclient_electron/blob/0f4b1a94da549cb1e9fcaf791707a4037a0cac8b/package.json
	// 	scripts: `dist/${process.env.APP_CONFIG}/electron/build/pkg-scripts`,
		// installLocation: '/Applications',
		// allowAnywhere       : true,
		// allowCurrentUserHome: true,
		// allowRootDirectory  : true,
	},
	appx: {
		publisher           : 'CN=E0A57107-907C-4488-87B2-6682204F223F',
		publisherDisplayName: 'App Template',
	},
	nsis: {
		oneClick  : true,
		perMachine: true,
	},
	portable: {

	},
	linux: {
		// target    : 'deb',
		target    : ['AppImage', 'deb'],
		icon      : 'appicon.icns',
		extraFiles: [
			'appicon.png',
		],
	},

	npmRebuild     : false,
	electronVersion: appConfig.installer.electronVersion,
	nodeVersion    : appConfig.installer.nodeVersion,

	// check sign package:
	// readonly        : true,
	// forceCodeSigning: true,

	artifactName: `${appConfig.appName} ${appConfig.appVersion}.\${ext}`,

	// store | normal | maximum
	// !! if you use maximum compress level, then portable app will very long start
	compression: 'store',

	// asar       : false,
}
