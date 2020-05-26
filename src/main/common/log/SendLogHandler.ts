import {ActionMode, ILogEvent, ILogger, LogLevel} from './contracts'
import {delay, escapeHtml, md5, removeExcessSpaces} from './helpers'
import {LogHandler} from './LogHandler'

export interface ISendLogMessage {
	Token: string
	Hash: string
	AppName: string
	AppVersion: string
	/** ISO */
	Time: string
	/** LogLevel name */
	Type: string,
	MessageShort: string
	MessageFull: string
}

export abstract class SendLogHandler extends LogHandler<'sendLog'> {
	public logUrl: string

	public constructor(logger: ILogger<any>, allowLogLevels: LogLevel, logUrl: string) {
		super({
			name: 'sendLog',
			logger,
			allowLogLevels,
		})
		this.logUrl = logUrl
	}

	protected abstract sendLog(
		logUrl: string,
		message: ISendLogMessage,
		selfError?: (...messagesOrErrors) => void,
	): Promise<{
		statusCode: number,
	}>

	protected async handleLog(logEvents: Array<ILogEvent<any>>) {
		const {logUrl} = this
		if (!logUrl || !logUrl.length) {
			return
		}

		const lastLogEvent = logEvents[logEvents.length - 1]
		const selfError = (...messagesOrErrors) => {
			this._logger.log({
				level: LogLevel.Error,
				messagesOrErrors,
				handlersModes: {
					...lastLogEvent.handlersModes,
					[this.name]: ActionMode.Never,
				},
			})
		}

		let errorWasWrite = false

		let body = logEvents
			.slice()
			.reverse()
			.map((logEvent, index) => {
				let logStr = `[${
					logEvent.dateString
				}][${
					this._logger.appName
				}][${
					LogLevel[logEvent.level]
				}][${
					index
				}]: ${
					logEvent.bodyString
				}`

				if (index === 0) {
					logStr += `\r\n\r\nAppInfo: ${
						logEvent.appInfo
					}`
				}

				return escapeHtml(logStr)
			})
			.join('\r\n<hr>\r\n')

		body = lastLogEvent.md5Hash + '\r\n' + '\r\n' + body

		const token = md5(lastLogEvent.md5Hash + '607bf405-a5a8-4b8c-aa61-41e8c1208dba')

		const message: ISendLogMessage = {
			Token: token,
			Hash: lastLogEvent.md5Hash,
			AppName: this._logger.appName,
			AppVersion: this._logger.appVersion,
			Type: LogLevel[lastLogEvent.level],
			Time: lastLogEvent.time.toISOString(),
			MessageFull: body,
			MessageShort: removeExcessSpaces(lastLogEvent.bodyString.substring(0, 200)),
		}

		let delayTime = 10000
		const maxDelayTime = 300000

		while (true) {
			try {
				const {statusCode} = await this.sendLog(logUrl, message, selfError)

				if (statusCode === 200) {
					return
				}

				if (statusCode === 429 || statusCode === 502 || statusCode === 504) {
					console.debug('Send log failed: Bad Connection')
				} else if (!errorWasWrite) {
					errorWasWrite = true
					selfError('Send log status code == ' + statusCode)
				}
			} catch (error) {
				console.debug('Send log failed: Bad Connection')
				// if (!errorWasWrite) {
				// 	errorWasWrite = true
				// 	selfError('Send log error', error)
				// }
			}

			await delay(delayTime)
			delayTime = delayTime * 2
			if (delayTime > maxDelayTime) {
				delayTime = maxDelayTime
			}
		}
	}
}
