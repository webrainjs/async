// tslint:disable-next-line:no-var-requires
import {ILogEvent, ILogEventParams, ILogHandlersModes, LogLevel} from './contracts'
import {md5} from './helpers'
import {objectToString} from './objectToString'

function getStackTraceCountFrames(level: LogLevel): number
{
	switch (level)
	{
		case LogLevel.Error:
			return 50
		case LogLevel.Fatal:
			return 100
		case LogLevel.UserError:
			return 10
		case LogLevel.UserWarning:
			return 10
		case LogLevel.Warning:
			return 5
	}

	return 0
}

export interface AppState {
	readonly [key: string]: string
}

export class LogEvent<HandlersNames extends string|number>
	implements ILogEvent<HandlersNames>
{
	// region constructor

	public readonly level: LogLevel
	public readonly messagesOrErrors: any|Error|Array<any|Error>
	public readonly handlersModes: ILogHandlersModes<HandlersNames>
	public readonly time: Date
	public readonly stack: string
	public readonly additionalHashString: string
	public readonly appState: AppState

	public constructor({
		level,
		messagesOrErrors,
		handlersModes,
		time,
		stack,
		additionalHashString,
		appState,
	}: {
		appState?: AppState,
	} & ILogEventParams<HandlersNames>)
	{
		this.level = level || LogLevel.Error
		this.messagesOrErrors = messagesOrErrors
		this.handlersModes = handlersModes
		this.time = time || new Date() // TODO - need UTC
		this.stack = stack
		this.additionalHashString = additionalHashString
		this.appState = appState

		if (!this.stack) {
			const stackTraceCountFrames = getStackTraceCountFrames(this.level)
			if (stackTraceCountFrames > 0) {
				this.stack = new Error('StackTrace').stack
			}
		}
	}

	// endregion

	// region calculable

	// region messages

	private _messages: string[]
	get messages(): string[] {
		if (this._messages == null) {
			this._messages = this.messagesOrErrors
				? (Array.isArray(this.messagesOrErrors)
					? this.messagesOrErrors
					: [this.messagesOrErrors])
					.filter(o => !(o instanceof Error))
					.map(o => o
						? (typeof o === 'object'
							? objectToString(o)
							: o.toString())
						: o + '')
				: []
		}
		return this._messages
	}

	private _messagesString
	get messagesString(): string {
		if (this._messagesString == null) {
			this._messagesString = this.messages.join('\r\n\r\n')
		}
		return this._messagesString
	}

	// endregion

	// region errors

	private _errors: Error[]
	get errors(): Error[] {
		if (this._errors == null) {
			this._errors = this.messagesOrErrors
				? (Array.isArray(this.messagesOrErrors)
					? this.messagesOrErrors
					: [this.messagesOrErrors])
					.filter(o => o instanceof Error) as Error[]
				: []
		}
		return this._errors
	}

	private _errorsString
	get errorsString(): string {
		if (this._errorsString == null) {
			this._errorsString = this.errors
				.map(objectToString as any)
				.join('\r\n\r\n')
		}
		return this._errorsString
	}

	// endregion

	// region console

	get consoleLevel() {
		switch (this.level) {
			case LogLevel.None:
			case LogLevel.Trace:
			case LogLevel.Debug:
				return 'debug'
			case LogLevel.Info:
				return 'info'
			case LogLevel.UserAction:
			case LogLevel.Action:
				return 'log'
			case LogLevel.UserWarning:
			case LogLevel.UserError:
			case LogLevel.Warning:
				return 'warn'
			case LogLevel.Error:
			case LogLevel.Fatal:
			default:
				return 'error'
		}
	}

	private _consoleString
	get consoleString(): string {
		if (this._consoleString == null) {
			this._consoleString = `\r\n[${
				this.dateString
			}][${
				LogLevel[this.level]
			}]: ${
				this.bodyString
			}`
		}
		return this._consoleString
	}

	// endregion

	// region time

	private _timeString
	get dateString(): string {
		if (this._timeString == null) {
			this._timeString = this.time.toISOString().replace('T', ' ').replace('Z', '')
		}
		return this._timeString
	}

	// endregion

	// region stack

	private _stackString
	get stackString(): string {
		if (this._stackString == null) {
			this._stackString = this.stack || ''
		}
		return this._stackString
	}

	// endregion

	// region appInfo

	private _appInfo
	get appInfo(): string {
		if (this._appInfo == null) {
			const {appState} = this
			this._appInfo = appState ? JSON.stringify(appState, null, 4) : ''
		}
		return this._appInfo
	}

	// endregion

	// region md5Hash

	private _md5Hash: string
	get md5Hash(): string {
		if (!this._md5Hash) {
			const buffer = []
			if (this.additionalHashString) {
				buffer.push(this.additionalHashString)
			}
			const errors = this.errors
			if (errors) {
				for (let i = 0, len = errors.length; i < len; i++) {
					const error = errors[i]
					let str = error.stack || error.toString()
					if (str) {
						const index = str.indexOf('\n')
						if (index >= 0) {
							str = str.substring(index + 1, str.length)
						}
					}
					buffer.push(str)
				}
			}
			if (this.stack) {
				buffer.push(this.stack)
			}
			if (this.appInfo) {
				buffer.push(this.appInfo)
			}
			// if (!buffer.length && this.messagesString) {
			// 	buffer.push(this.messagesString)
			// }
			const hashString = buffer.join('\r\n')

			this._md5Hash = md5(hashString)
		}
		return this._md5Hash
	}

	// endregion

	// region bodyString

	private _bodyString: string
	get bodyString(): string {
		if (!this._bodyString) {
			const buffer = []
			if (this.messagesString) {
				buffer.push(this.messagesString)
			}
			if (this.errorsString) {
				buffer.push(this.errorsString)
			}
			if (this.stackString) {
				buffer.push(this.stackString)
			}
			this._bodyString = buffer.join('\r\n\r\n')
		}
		return this._bodyString
	}

	// endregion

	// endregion
}
