/* eslint-disable no-process-env */
// noinspection NpmUsedModulesInstalled
import * as sapper from 'SAPPER_MODULE/server'
// noinspection NpmUsedModulesInstalled
import appConfig from 'APP_CONFIG_PATH'

import compression from 'compression'
// import polka from 'polka'
import express from 'express'
import sirv from 'sirv'
import path from 'path'
import {LogLevel} from './main/common/log/contracts'
import {logger} from './main/node/log/LoggerNode'
import './styles/index.jss'

logger.init({
	appName          : appConfig.appName,
	appVersion       : appConfig.appVersion,
	logUrl           : appConfig.logUrl,
	appState         : {...appConfig},
	logFilePath      : path.resolve('tmp/logs/sapper.txt'),
	writeToFileLevels: LogLevel.Any,
})

const dev = appConfig.sapper.buildMode === 'development'
// const isExport = process.env.npm_lifecycle_event === 'build:sapper:export'
// if (isExport) {
// 	console.log('Export mode')
// }

console.log('PORT=', process.env.PORT)
console.log('NODE_ENV=', process.env.NODE_ENV)

const server = express()
server.disable('x-powered-by')
server
	.use(
		'/app',
		compression({threshold: 0}),
		sirv('static', {dev}),
		sapper.middleware()
	)
	.listen(appConfig.sapper.port, err => {
		if (err) {
			console.log('error', err)
		}
	})
