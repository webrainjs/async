export enum LogLevel {
	Trace = 1,
	Debug = 2,
	Info = 4,
	UserAction = 8,
	Action = 16,
	UserWarning = 32,
	UserError = 64,
	Warning = 128,
	Error = 256,
	Fatal = 512,

	None = 0,
	Any = Trace | Debug | Info | UserAction | Action | UserWarning | UserError | Warning | Error | Fatal,
}

export enum ActionMode {
	Default,
	Always,
	Never,
}

export type ILogHandlersModes<Name extends string|number> = {
	[key in (Name | '_all')]?: ActionMode
}

export interface ILogEventParams<HandlersNames extends string|number> {
	level: LogLevel
	messagesOrErrors: any | Error | Array<any | Error>
	handlersModes?: ILogHandlersModes<HandlersNames>
	time?: Date
	stack?: string
	additionalHashString?: string
}

export interface ILogEvent<HandlersNames extends string|number>
	extends ILogEventParams<HandlersNames>
{
	readonly messages: string[]
	readonly messagesString: string
	readonly errors: Error[]
	readonly errorsString: string
	readonly consoleLevel: string
	readonly consoleString: string
	readonly dateString: string
	readonly stackString: string
	readonly appInfo: string
	readonly md5Hash: string
	readonly bodyString: string
}

export interface ILogHandler<Name extends string|number> {
	name: Name
	disabled: boolean
	allowLogLevels: LogLevel
	init()
	enqueueLog(logEvent: ILogEvent<Name>): void
}

export type ILogHandlers<HandlersNames extends string|number> = {
	[key in HandlersNames]: ILogHandler<HandlersNames>
}

export type ISubscriber<HandlersNames extends string|number>
	= (logEvent: ILogEvent<HandlersNames>) => void | Promise<void>
export type IUnsubscribe = () => void

export interface ILogger<HandlersNames extends string|number> {
	appName: string
	appVersion: string
	handlers: ILogHandlers<HandlersNames>

	error(error: Error)
	log(level: LogLevel, message: string, error?: Error)
	log(logEvent: ILogEventParams<HandlersNames>)
	subscribe(subscriber: ISubscriber<HandlersNames>): IUnsubscribe
	onLog(logEvent: ILogEventParams<HandlersNames>)
}
