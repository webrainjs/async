/* eslint-env browser */
// noinspection NpmUsedModulesInstalled
import * as sapper from 'SAPPER_MODULE/app'
import './initClientLog'
import {webrainGraph} from './components/dev/webrain/WebrainGraph'
import appConfig from 'APP_CONFIG_PATH'
import {openWebrainWindow} from './components/app/Webrain'
// import {brain} from './brain/facade' // TODO
import {createWindowController} from './main/browser/helpers/html-controllers/WindowController'

let appWindow
let appOrigin
window.addEventListener('message', e => {
	if (e.data === 'init') {
		appWindow = e.source
		appOrigin = e.origin
		console.log(`appWindow subscribed: ${appOrigin}`)
	}
})

webrainGraph.init()

sapper.start({
	target: document.querySelector('#sapper'),
})

createWindowController({
	windowName      : 'Main',
	storeWindowState: true,
	win             : window,
})
// brain.mainWindow.win = window // TODO

if (window.tray) {
	window.tray.subscribe('click', e => {
		if (e.id === 'icon') {
			// brain.mainWindow.show() // TODO
			window.widget.updateState({
				isVisible: true,
			})
		}
	})
}

if (appConfig.dev) {
	window.addEventListener('keydown', function (e) {
		if (e.key === 'F10') {
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

// Prevent to close window:
// if (window.minimize) {
// 	window.onbeforeunload = function () {
// 		return window.minimize() !== false || void 0
// 	}
// }
