/* eslint-disable no-process-env */
const globby = require('globby')
const {notarize} = require('electron-notarize')

if (!process.env.APP_CONFIG) {
	console.error('Environment variable APP_CONFIG is not defined', __filename)
	throw new Error('Environment variable APP_CONFIG is not defined')
}

const appConfig = require(`../../../../configs/${process.env.APP_CONFIG}`)

function getInstallerDir(appConfigType) {
	const paths = globby.sync(`dist/${appConfigType}/electron/pack/mac/*.app`, {
		expandDirectories: false,
		onlyFiles        : false,
	})
	if (paths.length !== 1) {
		throw Error('Found installers count != 1')
	}
	return paths[0]
}

async function macNotarize() {
	try {
		console.log('Try notarize app')
		await notarize({
			appBundleId    : appConfig.appId,
			appPath        : getInstallerDir(appConfig.type),
			appleId        : process.env.appleId,
			appleIdPassword: process.env.appSpecificPassword,
		})
		console.log('Success notarize')
	} catch (err) {
		console.error(err)
	}
}

module.exports = {
	macNotarize,
}
