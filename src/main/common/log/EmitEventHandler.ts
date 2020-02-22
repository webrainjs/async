import {ILogEvent, ILogger, LogLevel} from './contracts'
import {LogHandler} from './LogHandler'

export class EmitEventHandler extends LogHandler<'emitEvent'> {
	constructor(logger: ILogger<any>, allowLogLevels: LogLevel) {
		super({
			name: 'emitEvent',
			logger,
			allowLogLevels,
		})
	}

	protected async handleLog(logEvents: Array<ILogEvent<any>>): Promise<void> {
		for (let i = 0, len = logEvents.length; i < len; i++) {
			await this._logger.onLog(logEvents[i])
		}
	}
}
