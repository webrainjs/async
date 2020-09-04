/* eslint-env browser */
// noinspection NpmUsedModulesInstalled
import * as sapper from 'SAPPER_MODULE/app'
import appConfig from 'APP_CONFIG_PATH'
import './initWebrain'
import './initClientLog'
import './styles/index.jss'
import {openWebrainWindow} from './components/app/Webrain'
import {brain} from './brain/facade'
import {createWindowController} from './main/browser/helpers/html-controllers/WindowController'

// region init Chrome App:

// // region for Chrome App:
// if (!window.history.replaceState) {
// 	window.history.replaceState = () => {}
// }
// if (!window.history.pushState) {
// 	window.history.pushState = () => {}
// }

let appWindow
let appOrigin
window.addEventListener('message', e => {
	if (e.data === 'init') {
		appWindow = e.source
		appOrigin = e.origin
		console.debug(`appWindow subscribed: ${appOrigin}`)
	}
})

sapper.start({
	target: document.querySelector('#sapper'),
})

createWindowController(window, {
	windowName      : 'Main',
	storeWindowState: true,
	resizable       : true,
})
brain.mainWindow.win = window

if (appConfig.dev) {
	window.addEventListener('keydown', function (e) {
		if (e.code === 'F10') {
			openWebrainWindow()
		}
	})
}

if (!window.minimize) {
	window.minimize = () => {
		if (appWindow) {
			appWindow.postMessage('minimize', appOrigin)
			return true
		}
		return false
	}
}

// endregion

// region Prevent to close window:

if (window.hide || window.minimize) {
	window.onbeforeunload = function () {
		return (window.hide || window.minimize)() !== false || void 0
	}
}

// endregion
