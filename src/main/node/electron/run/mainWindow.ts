/* tslint:disable:no-var-requires */
// be closed automatically when the JavaScript object is garbage collected.
import {logger} from '@flemist/web-logger'
import {WindowPosition, WindowPositioner} from '../helpers/WindowPositioner'
import {appState} from './appState'
import {showTray} from './tray'

const { BrowserWindow } = require('electron')

function delay(timeMilliseconds) {
	return new Promise(resolve => setTimeout(resolve, timeMilliseconds))
}

function escapeJs(str: string): string {
	return str && str
		.replace(/[\\"']/g, '\\$&')
		.replace(/\u0000/g, '\\0')
		.replace(/\n/g, '\\n')
		.replace(/\r/g, '\\r')
}

let initialized = false
export async function createWindow(url) {
	if (initialized) {
		console.error('main window already initialized')
		return
	}
	initialized = true

	// to prevent deprecated warning only
	appState.app.allowRendererProcessReuse = true

	// Create the browser window.
	appState.win = new BrowserWindow({
		width: 1200,
		height: 700,
		webPreferences: {
			nativeWindowOpen: true,
			nodeIntegration: false,
			sandbox: true,
			preload: require.resolve('./preload'),
		},
		frame: false,
		skipTaskbar: true,
		// see: https://ourcodeworld.com/articles/read/315/how-to-create-a-transparent-window-with-electron-framework
		transparent: true,
		backgroundColor: '#01000001',
	})

	// Set options for child windows
	appState.win.webContents.on('new-window', function(e, _url, frameName, disposition, options) {
		options.show = false
		options.opacity = 0.01
		options.focusable = false
		options.transparent = true
		options.backgroundColor = '#01000001'
		options.width = 1
		options.height = 1

		console.debug('new-window: ' + frameName)
	})

	// hide instead close
	appState.win.on('close', function(event) {
		if (!appState.app.isQuitting) {
			event.preventDefault()
			appState.win.hide()
			console.log('hide')
		} else {
			console.log('close')
		}

		return false
	})

	appState.win.setSkipTaskbar(false)

	if (appState.appConfig.dev && appState.appConfig.dev.devTools && appState.appConfig.dev.devTools.openAtStart) {
		appState.win.webContents.openDevTools({
			mode    : 'undocked',
			activate: true,
		})
		await delay(2000)
	}

	// and load the index.html of the app.
	appState.win.loadURL(url)

	new WindowPositioner(appState.win).move(WindowPosition.Center)

	appState.win.webContents.on('did-finish-load', function() {
  		appState.win.webContents.executeJavaScript(`console.log('Log path:\\n${escapeJs((Object.values(logger.handlers) as any).filter(o => o.logFilePath)[0].logFilePath)}\\n')`)
	})
	logger.subscribe(logEvent => {
		if (appState.win) {
			appState.win.webContents.executeJavaScript(`console.${logEvent.consoleLevel}('${escapeJs(logEvent.consoleString)}')`)
		}
	})

	appState.app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (appState.win === null) {
			createWindow(url)
		} else {
			appState.win.show()
		}
	})

	// region closing

	// Emitted when the window is closed.
	appState.win.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		appState.win = null
		console.log('closed')
	})

	appState.app.on('before-quit', () => {
		appState.app.isQuitting = true
		console.log('before-quit')
	})

	// Not worked:
	// appState.win.on('close', event => {
	// 	if (appState.app.quitting) {
	// 		appState.win = null
	// 	} else {
	// 		event.preventDefault()
	// 		appState.win.hide()
	// 	}
	// })

	// endregion

	showTray()
}
