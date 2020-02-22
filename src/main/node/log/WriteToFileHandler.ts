/* tslint:disable:no-var-requires */
import {ILogEvent, ILogger, LogLevel} from '../../common/log/contracts'
import {LogHandler} from '../../common/log/LogHandler'

const fs = require('fs')
export const path = require('path')

function asPromise<TResult = any>(func: (callback: (err: Error, result?: TResult) => void) => void): Promise<TResult> {
	return new Promise((resolve, reject) => func((err, result) => {
		if (err) {
			reject(err)
			return
		}
		resolve(result)
	}))
}

async function autoCutLogFile(filePath: string, maxSize: number, cutToSize: number) {
	if (!fs.existsSync(filePath)) {
		return
	}

	const stat = await asPromise(callback => fs.stat(filePath, callback))
	if (!stat.isFile() || stat.size < maxSize) {
		return
	}

	const content = await asPromise(callback => fs.readFile(filePath, {encoding: 'utf8'}, callback))
	if (content.length < cutToSize) {
		return
	}

	await asPromise(callback => fs.writeFile(
		filePath,
		content.substring(content.length - cutToSize),
		{encoding: 'utf8'},
		callback,
	))
}

export class WriteToFileHandler extends LogHandler<'writeToFile'> {
	public logFilePath: string

	constructor(logger: ILogger<any>, allowLogLevels: LogLevel, logFilePath: string) {
		super({
			name: 'writeToFile',
			logger,
			allowLogLevels,
		})
		this.logFilePath = logFilePath
	}

	protected async handleLog(logEvents: Array<ILogEvent<any>>) {
		const logText = logEvents.map(logEvent => `\r\n\r\n[${
			this._logger.appVersion
		}][${
			logEvent.dateString
		}][${
			this._logger.appName
		}][${
			LogLevel[logEvent.level]
		}]: ${
			logEvent.bodyString
		}`).join('')

		const {logFilePath} = this
		const dirOutput = path.dirname(logFilePath)
		await asPromise(callback => fs.mkdir(dirOutput, {recursive: true}, callback))
		await asPromise(callback => fs.appendFile(logFilePath, logText, callback))
		await autoCutLogFile(logFilePath, 1000000, 500000)
	}
}
