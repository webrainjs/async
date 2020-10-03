/* tslint:disable:no-var-requires */
// @ts-ignore
import {App, BrowserWindow} from 'electron'
import {getRootPath} from '../helpers/server'
import {appState} from './appState'

const { Menu, Tray, nativeImage } = require('electron')
const path = require('path')
const {ipcMain} = require('electron')

function getTrayIconPath() {
	switch (process.platform) {
		case 'darwin':
			return 'static/favicon-mac-white.png'
		case 'linux':
			return 'appicon.png'
		default:
			return 'static/favicon.png'
	}
}

let initialized = false
export function showTray() {
	if (initialized) {
		console.error('tray already initialized')
		return
	}
	initialized = true

	const iconPath = path.resolve(
		getRootPath(appState.app),
		getTrayIconPath(),
	)
	appState.tray = new Tray(iconPath)

	const menu = Menu.buildFromTemplate([
		// {
		// 	id: 'about',
		// 	label: 'About',
		// 	click(item, window, event) {
		// 		appState.win.webContents.send('tray_onclick', { id: item.id })
		// 	},
		// },
		{
			id   : 'show',
			label: 'Show',
			click(item, window, event) {
				appState.win.show()
				appState.win.webContents.send('tray_onclick', { id: item.id })
			},
		},
		{
			id   : 'signin',
			label: 'Sign in',
			click(item, window, event) {
				appState.win.show()
				appState.win.webContents.send('tray_onclick', { id: item.id })
			},
		},
		{
			id   : 'signout',
			label: 'Sign out',
			click(item, window, event) {
				appState.win.show()
				appState.win.webContents.send('tray_onclick', { id: item.id })
			},
		},
		{ type: 'separator' },
		{
			id   : 'quit',
			label: 'Quit',
			click(item, window, event) {
				appState.quit()
			},
		},
	])
	appState.tray.setToolTip(`${appState.appConfig.appName} v${appState.appConfig.appVersion}`)
	appState.tray.setContextMenu(menu)
	appState.tray.on('click', () => {
		appState.win.show()
		appState.win.webContents.send('tray_onclick', { id: 'icon' })
	})

	ipcMain.addListener('tray_state', (event, state) => {
		if ('isLoggedIn' in state) {
			menu.getMenuItemById('signin').visible = !state.isLoggedIn
			menu.getMenuItemById('signout').visible = !!state.isLoggedIn
		}
	})
}
