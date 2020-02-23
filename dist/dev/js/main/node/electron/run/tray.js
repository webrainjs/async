"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.showTray = showTray;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _server = require("../helpers/server");

var _appState = require("./appState");

/* tslint:disable:no-var-requires */
// @ts-ignore
var _require = require('electron'),
    Menu = _require.Menu,
    Tray = _require.Tray,
    nativeImage = _require.nativeImage;

var path = require('path');

var _require2 = require('electron'),
    ipcMain = _require2.ipcMain;

function showTray() {
  var iconPath = path.resolve((0, _server.getRootPath)(_appState.appState.app), process.platform === 'darwin' ? 'static/favicon-mac-white.png' : 'static/favicon.png');
  _appState.appState.tray = new Tray(iconPath);
  var menu = Menu.buildFromTemplate([{
    id: 'about',
    label: 'About',
    click: function click(item, window, event) {
      _appState.appState.win.webContents.send('tray_onclick', {
        id: item.id
      });
    }
  }, {
    id: 'signin',
    label: 'Sign In',
    click: function click(item, window, event) {
      _appState.appState.win.webContents.send('tray_onclick', {
        id: item.id
      });
    }
  }, {
    id: 'signout',
    label: 'Sign Out',
    click: function click(item, window, event) {
      _appState.appState.win.webContents.send('tray_onclick', {
        id: item.id
      });
    }
  }, {
    type: 'separator'
  }, {
    id: 'exit',
    label: 'Exit',
    click: function click(item, window, event) {
      return (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _appState.appState.win.webContents.executeJavaScript('window.onbeforeunload = null');

              case 2:
                _appState.appState.app.quit();

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    }
  }]);

  _appState.appState.tray.setToolTip(_appState.appState.appConfig.appName + " v" + _appState.appState.appConfig.appVersion);

  _appState.appState.tray.setContextMenu(menu);

  _appState.appState.tray.on('click', function () {
    _appState.appState.win.webContents.send('tray_onclick', {
      id: 'icon'
    });
  });

  ipcMain.addListener('tray_state', function (event, state) {
    if ('isLoggedIn' in state) {
      menu.getMenuItemById('signin').visible = !state.isLoggedIn;
      menu.getMenuItemById('signout').visible = !!state.isLoggedIn;
    }
  });
}