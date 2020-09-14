// @ts-ignore
import {App, BrowserWindow, Tray, Menu} from 'electron'

class AppState {
	wpf?: any
	app?: App
	win?: BrowserWindow
	tray?: Tray
	menu?: Menu
	appConfig?: any

	async quit() {
		await this.win.webContents.executeJavaScript('window.onbeforeunload = null')
		this.app.quit()
	}
}

export const appState = new AppState()
