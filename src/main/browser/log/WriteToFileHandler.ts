/* tslint:disable:no-var-requires */
import {ActionMode, ILogEvent, ILogger, LogLevel} from '../../common/log/contracts'
import {LogHandler} from '../../common/log/LogHandler'
import {IRemoteLogger, IWriteToFileLogEvent} from './remoteLogger'

export class WriteToFileHandler extends LogHandler<'writeToFile'> {
	constructor(logger: ILogger<any>, allowLogLevels: LogLevel, logFileName: string) {
		super({
			name: 'writeToFile',
			logger,
			allowLogLevels,
		})
		this._logFileName = logFileName
	}

	private _logFileName: string
	public get logFileName(): string {
		return this._logFileName
	}
	public set logFileName(value: string) {
		this._logFileName = value
		console.log(`logFileName = ${this._logFileName}`)
		if (typeof window !== 'undefined' && (window as any).remoteLogger) {
			((window as any).remoteLogger as IRemoteLogger).setFileName(value)
		}
	}

	protected async handleLog(logEvents: Array<ILogEvent<any>>) {
		const remoteLogger: IRemoteLogger = typeof window !== 'undefined'
			? (window as any).remoteLogger
			: null

		if (!remoteLogger) {
			return
		}

		const sendLogEvents: Array<IWriteToFileLogEvent<any>> = logEvents.map(o => {
			return {
				level: o.level,
				dateString: o.dateString,
				appInfo: o.appInfo,
				handlersModes: {
					_all: ActionMode.Never,
					writeToFile: ActionMode.Always,
				},
				bodyString: o.bodyString,
			}
		})

		await remoteLogger.writeToFile(...sendLogEvents)
	}
}
