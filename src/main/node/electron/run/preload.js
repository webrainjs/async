/* eslint-disable */
'use strict'

const {remote, ipcRenderer, BrowserWindow} = require('electron')
const remoteWindow = remote.getCurrentWindow()
const appConfig = ipcRenderer.sendSync('app-config')

console.debug('preload')

function delay(timeMilliseconds) {
	return new Promise(resolve => setTimeout(resolve, timeMilliseconds))
}

function initWindow(window, remoteWindow) {
	// region appConfig

	Object.defineProperty(window, 'appConfig', {
		writable    : false,
		enumerable  : true,
		configurable: false,
		value       : Object.freeze(Object.assign({}, appConfig)),
	})

	window.isElectron = true

	// region remote logger

	window.remoteLogger = (() => ({
		setFileName(value) {
			ipcRenderer.send('logger_setFileName', value)
		},
		writeToFile(...logEvents) {
			ipcRenderer.send('logger_writeToFile', logEvents)
		}
	}))()

	//endregion

	// region window actions

	const open = window.open.bind(window)
	window.open = function (...args) {
		const featuresStr = args[2]
		const features = (featuresStr || '')
			.split(',')
			.map(o => o
				.split('=')
				.map(o2 => o2.trim()))
			.reduce((a, o) => {
				let value = o[1]
				a[o[0]] = !(value === '0' || value === 'no')
				return a
			}, {})

		const oldWindows = remote.BrowserWindow.getAllWindows()

		const childWindow = open(...args)
		childWindow.document.documentElement.style.display = 'none'
		childWindow.document.documentElement.style.backgroundColor = '#01000001'

		const newWindows = remote.BrowserWindow.getAllWindows()

		let newWindow
		for (let i = 0, len = newWindows.length; i < len; i++) {
			const win = newWindows[i]
			if (oldWindows.indexOf(win) < 0) {
				if (newWindow) {
					throw new Error('Found more than one new window')
				}
				newWindow = win
			}
		}
		if (!newWindow) {
			throw new Error('New window not found')
		}

		const remoteChildWindow = newWindow

		remoteChildWindow.setBackgroundColor('#00FFFFFF')
		// remoteChildWindow.transparent = true
		remoteChildWindow.setAlwaysOnTop(!!features.alwaysOnTop)
		remoteChildWindow.resizable = !!features.resizable
		remoteChildWindow.movable = !!features.movable
		remoteChildWindow.fullScreenable = !!features.fullscreenable

		// not needed:
		// initWindow(childWindow, remoteChildWindow)

		// fix electron bug with close about:blank windows
		// see: https://github.com/electron/electron/issues/20086
		childWindow.close = async () => {
			if (remoteChildWindow.isDestroyed()) {
				return
			}

			const href = childWindow.location.href
			childWindow.location.href = 'http://0.0.0.0/'
			remoteChildWindow.hide()

			try {
				while (href === childWindow.location.href) {
					// eslint-disable-next-line no-await-in-loop
					await delay(50)
				}
			} catch {
			}

			if (remoteChildWindow.isDestroyed()) {
				return
			}

			remoteChildWindow.close()
		}

		remoteChildWindow.show()
		remoteChildWindow.setOpacity(1)
		remoteChildWindow.setFocusable(true)

		childWindow.document.documentElement.style.display = ''

		return childWindow
	}

	let windowRect
	window.saveRect = function() {
		if (windowRect == null
			&& !remoteWindow.isMinimized()
			&& !remoteWindow.isMaximized()
			&& !window.document.fullscreenElement
			&& !window.document.webkitFullscreenElement
		) {
			windowRect = {
				x: window.screenLeft,
				y: window.screenTop,
				width: window.outerWidth,
				height: window.outerHeight
			}
		}
	}

	window.restoreRect = function() {
		if (windowRect != null
			&& !remoteWindow.isMinimized()
			&& !remoteWindow.isMaximized()
			&& !window.document.fullscreenElement
			&& !window.document.webkitFullscreenElement
		) {
			window.resizeTo(windowRect.width, windowRect.height)
			window.moveTo(windowRect.x, windowRect.y)
			windowRect = null
		}
	}

	window.maximize = function () {
		window.saveRect()
		remoteWindow.setSkipTaskbar(false)
		remoteWindow.maximize()
	}
	window.minimize = function () {
		window.saveRect()
		remoteWindow.minimize()
	}
	window.hide = function () {
		window.saveRect()
		remoteWindow.minimize()
		remoteWindow.setSkipTaskbar(true)
	}
	window.show = function () {
		remoteWindow.setSkipTaskbar(false)
		remoteWindow.show()
		window.restoreRect()
	}
	window.setOpacity = function (value) {
		remoteWindow.setOpacity(value)
	}
	window.restore = function () {
		remoteWindow.setSkipTaskbar(false)
		remoteWindow.restore()
		window.restoreRect()
	}

	const focus = window.focus.bind(window)
	window.focus = (...args) => {
		remoteWindow.show()
		focus(...args)
	}

	// endregion

	// region tray

	window.tray = (() => ({
		updateState(state) {
			ipcRenderer.send('tray_state', state)
		},
		subscribe(eventName, listener) {
			ipcRenderer.on('tray_on' + eventName, (event, ...args) => {
				listener(...args)
			})
		},
	}))()

	// endregion

	// region Dev

	if (appConfig.dev && appConfig.dev.devTools) {
		window.dev = {
			openDevTools() {
				remoteWindow.webContents.openDevTools({
					mode    : 'undocked',
					activate: true,
				})
			},
		}

		window.addEventListener('keydown', function (e) {
			if (e.code === 'F12') {
				window.dev.openDevTools()
			}
		})
	}

	// endregion
}

initWindow(window, remoteWindow)
