import {ThenableOrValue} from 'webrain'
import {notificationWindowsController} from '../../../main/browser/helpers/html-controllers/NotificationWindowsController'
import {
	IWindowControllerFactoryOptions,
	WindowControllerFactory,
} from '../../../main/browser/helpers/html-controllers/WindowController'
import {ComponentWindow} from '../ComponentWindow'

export function showNotificationWindowFactory<TProps extends object>({
	windowOptions,
	componentClass,
}: {
	windowOptions?: IWindowControllerFactoryOptions,
	componentClass: new () => any,
}) {
	let win: ComponentWindow
	return async function showNotification(props: TProps) {
		if (props) {
			if (!win) {
				win = new ComponentWindow({
					windowControllerFactory: new WindowControllerFactory({
						windowFeatures: 'width=110,height=110,'
							+ 'titlebar=no,resizable=no,movable=yes,alwaysOnTop=yes,fullscreenable=no,'
							+ 'location=no,toolbar=no,scrollbars=no,menubar=no,status=no,directories=no,'
							+ 'dialog=yes,modal=yes,dependent=yes',
						...windowOptions,
						windowControllerOptions: {
							windowName      : componentClass.name,
							storeWindowState: false,
							...windowOptions.windowControllerOptions,
						},
					}),
					componentClass,
					props,
				})
			} else {
				win.setProps(props)
			}

			if (!win.windowController) {
				console.error('Cannot create windowController')
				return
			}

			notificationWindowsController.show(win.windowController.win)
		} else {
			if (win) {
				win.close()
			}
		}
	}
}

export interface INotificationApiOptions extends NotificationOptions {
	title?: string
	onclick?(event): void
	onclose?(event): void
}

export function showNotificationApiFactory<TOptions extends INotificationApiOptions>({
	defaultOptions,
}: {
	defaultOptions?: TOptions,
}) {
	let notification: Notification
	return async function showNotification(options: TOptions) {
		if (notification) {
			notification.close()
			notification = null
		}
		if (options) {
			options = { ...defaultOptions, ...options }
			notification = new Notification(options.title, options)
			if (options.onclick) {
				notification.addEventListener('click', options.onclick)
			}
			if (options.onclose) {
				notification.addEventListener('close', options.onclose)
			}
		}
	}
}

export function showNotificationFactory<TProps extends object>(options: {
	notificationWindow?: {
		windowOptions?: IWindowControllerFactoryOptions,
		componentClass: new () => any,
	},
	notificationApi?: {
		defaultOptions?: INotificationApiOptions,
		getOptions(props: TProps): ThenableOrValue<INotificationApiOptions>,
	},
}) {
	if (typeof window !== 'undefined' && (window as any).isElectron && options.notificationWindow) {
		return showNotificationWindowFactory(options.notificationWindow)
	}

	if (options.notificationApi) {
		const showNotification = showNotificationApiFactory({
			defaultOptions: options.notificationApi.defaultOptions,
		})
		return async (props: TProps) => showNotification(props && await options.notificationApi.getOptions(props))
	}

	return null
}
