import {ILogEvent, ILogger, ILogHandler, LogLevel} from './contracts'
import {LogHandler} from './LogHandler'

export class CombineLogHandlers<Name extends string | number> implements ILogHandler<Name> {
	public logHandlers: Array<LogHandler<Name>>
	public name: Name
	public allowLogLevels: LogLevel
	public disabled: boolean

	public constructor(logger: ILogger<any>, ...logHandlers: Array<LogHandler<Name>>) {
		this.name = logHandlers[0].name
		this.logHandlers = logHandlers
		this.allowLogLevels = LogLevel.Any
	}

	public init() {
		for (let i = 0, len = this.logHandlers.length; i < len; i++) {
			this.logHandlers[i].init()
		}
	}

	public enqueueLog(logEvent: ILogEvent<Name>) {
		for (let i = 0, len = this.logHandlers.length; i < len; i++) {
			this.logHandlers[i].enqueueLog(logEvent)
		}
	}
}
