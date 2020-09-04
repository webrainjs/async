/* eslint-disable no-sync */
const {run, singleCall, singleProcess} = require('../helpers/helpers')
// const builds = require('./builds')
// const common = require('../common')

const deploy = singleCall(async appConfigType => {
	// await Promise.all([
	// 	common.build(),
	// 	builds.buildSapperExport(appConfigType),
	// ])

	// docs: https://www.electron.build/cli
	await run(
		'node ./env/deploy/deploy.js',
		{env: {APP_CONFIG: appConfigType}}
	)
})

module.exports = {
	deploy,
}
