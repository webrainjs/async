import {CombineLogHandlers} from '../../common/log/CombineLogHandlers'
import {ILogEvent, LogLevel} from '../../common/log/contracts'
import {EmitEventHandler} from '../../common/log/EmitEventHandler'
import {Logger} from '../../common/log/Logger'
import {WriteToConsoleHandler} from '../../common/log/WriteToConsoleHandler'
import {SendLogHandlerNode} from './SendLogHandlerNode'
import {path, WriteToFileHandler} from './WriteToFileHandler'

type HandlersNames = 'writeToConsole' | 'writeToFile' | 'sendLog' | 'emitEvent'

export class LoggerNode extends Logger<HandlersNames> {
	public init({
		appName,
		appVersion,
		logDir,
		logFileName,
		logUrls,
		writeToConsoleLevels = LogLevel.Any,
		writeToFileLevels = LogLevel.Fatal | LogLevel.Error | LogLevel.Warning | LogLevel.UserError | LogLevel.UserWarning,
		sendLogLevels = LogLevel.Fatal | LogLevel.Error | LogLevel.Warning | LogLevel.UserError | LogLevel.UserWarning,
		emitEventLevels = LogLevel.Any,
		filter,
		appState,
	}: {
		appName: string,
		appVersion: string,
		logDir: string,
		logFileName: string,
		logUrls: string[],
		writeToConsoleLevels?: LogLevel,
		writeToFileLevels?: LogLevel,
		sendLogLevels?: LogLevel,
		emitEventLevels?: LogLevel,
		filter?: (logEvent: ILogEvent<HandlersNames>) => boolean,
		appState?: object,
	}) {
		this.logUnhandledErrors()

		super._init({
			appName,
			appVersion,
			handlers: [
				new WriteToConsoleHandler(this, writeToConsoleLevels),
				new WriteToFileHandler(this, writeToFileLevels, path.resolve(logDir), logFileName),
				logUrls && logUrls.length && new CombineLogHandlers(this,
					...logUrls.map(logUrl => new SendLogHandlerNode(this, sendLogLevels, logUrl))),
				new EmitEventHandler(this, emitEventLevels),
			],
			filter,
			appState,
		})
	}

	private logUnhandledErrors() {
		process
			.on('unhandledRejection', (...args) => {
				this.error('process.unhandledRejection', ...args)
			})
			.on('uncaughtException', (...args) => {
				this.error('process.uncaughtException', ...args)
			})
	}
}

export const logger = new LoggerNode()
