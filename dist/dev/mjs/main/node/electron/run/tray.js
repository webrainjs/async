/* tslint:disable:no-var-requires */
// @ts-ignore
import { getRootPath } from '../helpers/server';
import { appState } from './appState';

const {
  Menu,
  Tray,
  nativeImage
} = require('electron');

const path = require('path');

const {
  ipcMain
} = require('electron');

export function showTray() {
  const iconPath = path.resolve(getRootPath(appState.app), process.platform === 'darwin' ? 'static/favicon-mac-white.png' : 'static/favicon.png');
  appState.tray = new Tray(iconPath);
  const menu = Menu.buildFromTemplate([{
    id: 'about',
    label: 'About',

    click(item, window, event) {
      appState.win.webContents.send('tray_onclick', {
        id: item.id
      });
    }

  }, {
    id: 'signin',
    label: 'Sign In',

    click(item, window, event) {
      appState.win.webContents.send('tray_onclick', {
        id: item.id
      });
    }

  }, {
    id: 'signout',
    label: 'Sign Out',

    click(item, window, event) {
      appState.win.webContents.send('tray_onclick', {
        id: item.id
      });
    }

  }, {
    type: 'separator'
  }, {
    id: 'exit',
    label: 'Exit',

    async click(item, window, event) {
      await appState.win.webContents.executeJavaScript('window.onbeforeunload = null');
      appState.app.quit();
    }

  }]);
  appState.tray.setToolTip(`${appState.appConfig.appName} v${appState.appConfig.appVersion}`);
  appState.tray.setContextMenu(menu);
  appState.tray.on('click', () => {
    appState.win.webContents.send('tray_onclick', {
      id: 'icon'
    });
  });
  ipcMain.addListener('tray_state', (event, state) => {
    if ('isLoggedIn' in state) {
      menu.getMenuItemById('signin').visible = !state.isLoggedIn;
      menu.getMenuItemById('signout').visible = !!state.isLoggedIn;
    }
  });
}