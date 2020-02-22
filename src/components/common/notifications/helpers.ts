import {notificationWindowsController} from '../../../main/browser/helpers/html-controllers/NotificationWindowsController'
import {
	IWindowControllerFactoryOptions,
	WindowControllerFactory,
} from '../../../main/browser/helpers/html-controllers/WindowController'
import {ComponentWindow} from '../ComponentWindow'

export function showNotificationFactory<TProps extends object>({
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
						windowName: componentClass.name,
						windowFeatures: 'width=110,height=110,' +
							'titlebar=no,resizable=no,movable=yes,alwaysOnTop=yes,fullscreenable=no,' +
							'location=no,toolbar=no,scrollbars=no,menubar=no,status=no,directories=no,' +
							'dialog=yes,modal=yes,dependent=yes',
						storeWindowState: false,
						...windowOptions,
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
