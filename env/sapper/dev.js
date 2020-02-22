/* eslint-disable no-process-env */
const watcher = require('./watcher-custom')

// if (!process.env.APP_CONFIG) {
// 	console.error('Environment variable APP_CONFIG is not defined', __filename)
// 	throw new Error('Environment variable APP_CONFIG is not defined')
// }

// process.env.NODE_ENV = 'development'
// const appConfig = require(`../../configs/${process.env.APP_CONFIG}`)

watcher.watch({
	// 'dev-port': 3000,
	// port      : appConfig.sapper.port,
	dest  : '__sapper__/debug',
	output: 'src/node_modules/@sapper/debug',
	// live  : false,
})
