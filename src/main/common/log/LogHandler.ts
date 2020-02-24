import {ActionMode, ILogEvent, ILogEventParams, ILogger, ILogHandler, LogLevel} from './contracts'
import {delay} from './helpers'

export function canDoAction(actionMode: ActionMode, allowedLevels: LogLevel, level: LogLevel) {
	return actionMode === ActionMode.Always
		|| actionMode !== ActionMode.Never && (allowedLevels & level) !== 0
}

export abstract class LogHandler<Name extends string | number>
	implements ILogHandler<Name>
{
	private readonly _queue: Array<ILogEvent<Name>> = []
	private _inProcess: boolean
	private readonly _maxQueueSize: number
	private readonly _throttleMaxQueueSize: number
	private readonly _throttleTime: number
	protected readonly _logger: ILogger<Name>
	public allowLogLevels: LogLevel
	public name: Name
	public disabled: boolean

	protected constructor({
		name,
		logger,
		allowLogLevels,
		maxQueueSize,
		throttleMaxQueueSize,
		throttleTime,
	}: {
		name: Name,
		logger: ILogger<Name>,
		allowLogLevels?: LogLevel,
		maxQueueSize?: number,
		throttleMaxQueueSize?: number,
		throttleTime?: number,
	}) {
		this.name = name
		this._logger = logger
		this.allowLogLevels = allowLogLevels || LogLevel.Any
		this._maxQueueSize = maxQueueSize || 10
		this._throttleMaxQueueSize = throttleMaxQueueSize || 5
		this._throttleTime = throttleTime || 0
	}

	// tslint:disable-next-line:no-empty
	public init() {

	}

	private canLog(logEvent: ILogEvent<Name>): boolean {
		return !this.disabled && canDoAction(
			logEvent.handlersModes
				? logEvent.handlersModes[this.name] || logEvent.handlersModes._all || ActionMode.Default
				: ActionMode.Default,
			this.allowLogLevels,
			logEvent.level,
		)
	}

	private onError(logEvents: Array<ILogEventParams<Name>>, error: Error) {
		handleLogErrorHandler<Name>(logEvents, error, this._logger, newLogEvent => {
			if (!newLogEvent.handlersModes) {
				newLogEvent.handlersModes = {}
			}
			newLogEvent.handlersModes[this.name] = ActionMode.Never
		})
	}

	protected abstract handleLog(logEvents: Array<ILogEvent<Name>>): void | Promise<void>

	public enqueueLog(logEvent: ILogEvent<Name>) {
		const canLog = this.canLog(logEvent)

		while (this._queue.length > this._maxQueueSize && !this.canLog(this._queue[0])) {
			this._queue.shift()
		}

		this._queue.push(logEvent)

		if (!canLog || this._inProcess) {
			return
		}

		// noinspection JSIgnoredPromiseFromCall
		this.handleLogs()
	}

	private async handleLogs() {
		if (this._inProcess) {
			return
		}
		try {
			do {
				if (this._throttleTime && this._queue.length < this._throttleMaxQueueSize) {
					await delay(this._throttleTime)
				}

				if (!this._queue.length) {
					break
				}

				const logEvents = this._queue.splice(0)
				try {
					await this.handleLog(logEvents)
				} catch (err) {
					this.onError(logEvents, err)
				}
			} while (this._queue.some(o => this.canLog(o)))
		} finally {
			this._inProcess = false
		}
	}
}

export function handleLogErrorHandler<HandlersNames extends string|number>(
	logEvents: Array<ILogEventParams<HandlersNames>>,
	error: Error,
	logger: ILogger<HandlersNames>,
	changeNewLogEvent: (newLogEvent: ILogEventParams<HandlersNames>) => void,
): void {
	const _changeNewLogEvent = (newLogEvent: ILogEventParams<HandlersNames>) => {
		changeNewLogEvent(newLogEvent)
		return newLogEvent
	}

	// for (let i = 0, len = logEvents.length; i < len; i++) {
	// 	const logEvent = logEvents[i]
	// 	logger.log(_changeNewLogEvent({
	// 		level: logEvent.level,
	// 		message: logEvent.message,
	// 		error: logEvent.error,
	// 		stack: logEvent.stack,
	// 		time: logEvent.time,
	// 		writeConsoleMode: logEvent.writeConsoleMode,
	// 		sendLogMode: logEvent.sendLogMode,
	// 		writeFileMode: logEvent.writeFileMode,
	// 	}))
	// }

	const lastLogEvent = logEvents[logEvents.length - 1]
	logger.log(_changeNewLogEvent({
		level: LogLevel.Error,
		messagesOrErrors: ['Logger self error', error],
		handlersModes: lastLogEvent.handlersModes,
	}))
}
