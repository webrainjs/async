/* tslint:disable:no-var-requires */
// @ts-ignore
import {logger, WriteToFileHandler} from '@flemist/web-logger/node/mjs/index'

const {ipcMain} = require('electron')

export function bindRemoteLogger(logFileNameDefault: string) {
	ipcMain.addListener('logger_setFileName', (event, value) => {
		const handler = (logger.handlers.writeToFile as WriteToFileHandler)
		handler.logFileName = value
			? value.replace(/[^\w.\-]+/, '_')
			: logFileNameDefault
	})
	ipcMain.addListener('logger_writeToFile', (event, logEvents: any[]) => {
		const handler = (logger.handlers.writeToFile as WriteToFileHandler)
		for (let i = 0, len = logEvents.length; i < len; i++) {
			handler.enqueueLog(logEvents[i])
		}
	})
}
