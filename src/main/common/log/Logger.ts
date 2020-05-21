/* tslint:disable:no-var-requires */
import {
	ActionMode, ILogEvent,
	ILogEventParams,
	ILogger, ILogHandler, ILogHandlers,
	ISubscriber,
	IUnsubscribe,
	LogLevel,
} from './contracts'
import {globalScope} from './helpers'
import {LogEvent} from './LogEvent'

// region Logger

export class Logger<HandlersNames extends string|number> implements ILogger<HandlersNames> {
	public handlers: ILogHandlers<HandlersNames>
	public minTimeBetweenEqualEvents: number = 120000
	public filter: (logEvent: ILogEvent<HandlersNames>) => boolean
	private _logEventsTime: {
		[key: string]: number,
	} = {}

	// region init

	public appName: string
	public appVersion: string
	public appState: object
	private _initialized: boolean

	protected _init({
		appName,
		appVersion,
		handlers,
		filter,
		appState,
	}: {
		appName: string,
		appVersion: string,
		handlers: Array<ILogHandler<HandlersNames>>,
		filter?: (logEvent: ILogEvent<HandlersNames>) => boolean,
		appState?: object,
	}) {
		if (this._initialized) {
			this.error('Logger already initialized')
			return
		}
		this._initialized = true

		this.appName = appName
		this.appVersion = appVersion

		const handlersObject: ILogHandlers<HandlersNames> = {} as any
		for (let i = 0, len = handlers.length; i < len; i++) {
			const handler = handlers[i]
			if (handler) {
				handlersObject[handler.name] = handler
				handler.init()
			}
		}
		this.handlers = handlersObject

		this.filter = filter
		this.appState = appState

		this.interceptEval()

		const logEvent: ILogEventParams<HandlersNames> = {
			level: LogLevel.Info,
			messagesOrErrors: `Start App: ${appName} v${appVersion}`,
			handlersModes: {
				_all: ActionMode.Always,
			} as any,
		}

		this.log(logEvent)
	}

	private interceptEval() {
		const oldEval = globalScope.eval
		delete globalScope.eval
		globalScope.eval = str => {
			if (str.indexOf('async function') >= 0) {
				return oldEval.call(globalScope, str)
			}

			try {
				return oldEval.call(globalScope, str)
			} catch (ex) {
				this.error('eval error', ex, str)
				throw ex
			}
		}
	}

	// endregion

	// region log interface

	public debug(...messagesOrErrors: Array<any|Error>) {
		this.log({
			level: LogLevel.Debug,
			messagesOrErrors,
		})
	}

	public info(...messagesOrErrors: Array<any|Error>) {
		this.log({
			level: LogLevel.Info,
			messagesOrErrors,
		})
	}

	public action(...messagesOrErrors: Array<any|Error>) {
		this.log({
			level: LogLevel.Action,
			messagesOrErrors,
		})
	}

	public warn(...messagesOrErrors: Array<any|Error>) {
		this.log({
			level: LogLevel.Warning,
			messagesOrErrors,
		})
	}

	public error(...messagesOrErrors: Array<any|Error>) {
		this.log({
			level: LogLevel.Error,
			messagesOrErrors,
		})
	}

	public log(level: LogLevel, ...messagesOrErrors: Array<any|Error>)
	public log(logEvent: ILogEventParams<HandlersNames>)
	public log(logEventOrLevel: ILogEventParams<HandlersNames> | LogLevel, ...messagesOrErrors: Array<any|Error>) {
		if (logEventOrLevel != null && typeof logEventOrLevel === 'object') {
			this._log(logEventOrLevel instanceof LogEvent
				? logEventOrLevel
				: this.createLogEvent(logEventOrLevel))
		} else {
			this._log(this.createLogEvent({
				level: logEventOrLevel as LogLevel,
				messagesOrErrors,
			}))
		}
	}

	// endregion

	// region log handlers

	private createLogEvent(params: ILogEventParams<HandlersNames>): ILogEvent<HandlersNames> {
		(params as any).appState = {
			appName: this.appName,
			appVersion: this.appVersion,
			...this.appState,
		}
		return new LogEvent(params)
	}

	private _log(logEvent: ILogEvent<HandlersNames>) {
		const {filter} = this
		if (filter && !filter(logEvent)) {
			return
		}

		const {_logEventsTime} = this
		const time = _logEventsTime[logEvent.bodyString]
		if (time != null && time + this.minTimeBetweenEqualEvents > logEvent.time.getTime()) {
			return
		}
		_logEventsTime[logEvent.bodyString] = logEvent.time.getTime()

		const {handlers} = this
		for (const key in handlers) {
			if (Object.prototype.hasOwnProperty.call(handlers, key)) {
				const handler = handlers[key]
				if (handler) {
					handler.enqueueLog(logEvent)
				}
			}
		}
	}

	// endregion

	// region log event

	private _subscribers: Array<ISubscriber<HandlersNames>> = []
	public subscribe(subscriber: ISubscriber<HandlersNames>): IUnsubscribe {
		this._subscribers.push(subscriber)
		return () => {
			const index = this._subscribers.indexOf(subscriber)
			if (index >= 0) {
				this._subscribers.splice(index, 1)
			}
		}
	}

	public async onLog(logEvent: ILogEvent<HandlersNames>): Promise<void> {
		if (this._subscribers.length) {
			for (let i = 0; i < this._subscribers.length; i++) {
				const subscriber = this._subscribers[i]
				try {
					await subscriber(logEvent)
				} catch (error) {
					this._subscribers.splice(i, 1)
					this.log(new LogEvent({
						level: LogLevel.Error,
						messagesOrErrors: [`onLog() error in ${subscriber}`, error],
					}))
				}
			}
		}
	}

	// endregion
}

// endregion
