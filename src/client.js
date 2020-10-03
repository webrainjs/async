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
import {tick} from 'svelte'
import {delay} from 'webrain'

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

async function initMainWindow() {
	const windowController = createWindowController(window, {
	windowName      : 'Main',
	storeWindowState: true,
	resizable       : true,
})
brain.mainWindow.win = window

	await windowController.waitInit()

	if (window.show) {
		window.show()
	}

	await tick()
	await delay(50)
	await tick()

	document.body.style.display = null

	await tick()
	await delay(10)
	await tick()

	// if (window.setOpacity) {
	// 	window.setOpacity(1)
	// }
	document.body.style.opacity = null
}
initMainWindow()

if (appConfig.dev) {
	window.addEventListener('keydown', function keydown(e) {
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
	window.onbeforeunload = function onbeforeunload() {
		return (window.hide || window.minimize)() !== false || void 0
	}
}

// endregion
