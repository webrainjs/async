import {ILogHandlersModes, LogLevel} from '../../common/log/contracts'

export interface IWriteToFileLogEvent<HandlersNames extends string | number> {
	level: LogLevel
	handlersModes?: ILogHandlersModes<HandlersNames>
	dateString: string
	appInfo: string
	bodyString: string
}

export interface IRemoteLogger {
	setFileName(value: string)

	writeToFile(...logEvents: Array<IWriteToFileLogEvent<any>>)
}
