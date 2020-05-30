// @ts-ignore
import {App, BrowserWindow, Tray} from 'electron'

export const appState: {
	wpf?: any,
	app?: App|any,
	win?: BrowserWindow,
	tray?: Tray,
	appConfig?: any,
} = {}
