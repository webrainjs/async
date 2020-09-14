// @ts-ignore
import {Menu, MenuItem} from 'electron'
import {appState} from './appState'

export function showAppMenu() {
	const appMenuItem = new MenuItem({
		label: appState.app.getName(),
		submenu: [
			{ role: 'hide' },
			{
				label: `Quit ${appState.app.getName()}`,
				accelerator: 'CmdOrCtrl+Q',
				click() {
					appState.quit()
				},
			},
		],
	})

	const windowMenuItem = new MenuItem({
		role: 'window',
		submenu: [
			{ role: 'minimize' },
			{
				label: 'Close Window',
				accelerator: 'CmdOrCtrl+W',
				click() {
					appState.app.hide()
				},
			},
		],
	})

	appState.menu = new Menu()

	appState.menu.append(appMenuItem)
	appState.menu.append(windowMenuItem)

	Menu.setApplicationMenu(appState.menu)
}
