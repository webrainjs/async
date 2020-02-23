import {
	ObservableClass,
} from 'webrain'
import {getWindowController, WindowController} from './WindowController'

const UNSUBSCRIBERS_PROPERTY_NAME = '61e3ecc3f7ff48f2ab75bc7f8c86ed3b'
let unsubscribePropertyIndex = 1

class NotificationWindowsController extends ObservableClass {
	private readonly _windowControllers: WindowController[] = []
	private readonly _unsubscribePropertyName = UNSUBSCRIBERS_PROPERTY_NAME + unsubscribePropertyIndex++
	public margin: number = 16

	public show(win: Window) {
		const controller = getWindowController(win)
		const unsubscribers = controller[this._unsubscribePropertyName] = []
		unsubscribers.push(controller.loadObservable.subscribe(o => {
			this.onLoad(win)
		}))
		unsubscribers.push(controller.resizeObservable.subscribe(o => {
			this.onResize(win)
		}))
		unsubscribers.push(controller.closeObservable.subscribe(o => {
			this.onClose(win)
		}))

		this._windowControllers.push(controller)
		this.updatePositions()
	}

	private updatePositions() {
		const width = screen.availWidth
		const height = screen.availHeight

		for (let i = 0; i < this._windowControllers.length; i++) {
			const controller = this._windowControllers[i]
			if (controller.isOpened && controller.isLoaded) {
				controller.win.moveTo(
					width - controller.sizeController.width - this.margin || 0,
					height - controller.sizeController.height - this.margin || 0,
				)
			}
		}
	}

	public onClose(win) {
		const controller = getWindowController(win)
		const unsubscribers = controller[this._unsubscribePropertyName]
		delete controller[this._unsubscribePropertyName]
		for (let i = 0, len = unsubscribers.length; i < len; i++) {
			unsubscribers[i]()
		}

		const index = this._windowControllers.indexOf(controller)
		this._windowControllers.slice(index, 1)

		this.updatePositions()
	}

	public onLoad(win) {
		this.updatePositions()
	}

	public onResize(win) {
		this.updatePositions()
	}
}

export const notificationWindowsController = new NotificationWindowsController()
