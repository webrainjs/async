"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.createWindow = createWindow;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _helpers = require("../../../common/log/helpers");

var _LoggerNode = require("../../log/LoggerNode");

var _WindowPositioner = require("../helpers/WindowPositioner");

var _appState = require("./appState");

var _tray = require("./tray");

/* tslint:disable:no-var-requires */
// be closed automatically when the JavaScript object is garbage collected.
var _require = require('electron'),
    BrowserWindow = _require.BrowserWindow;

function createWindow(_x) {
  return _createWindow.apply(this, arguments);
}

function _createWindow() {
  _createWindow = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(url) {
    return _regenerator.default.wrap(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Create the browser window.
            _appState.appState.win = new BrowserWindow({
              width: 1200,
              height: 700,
              webPreferences: {
                nativeWindowOpen: true,
                nodeIntegration: false,
                sandbox: true,
                preload: require.resolve('./preload')
              },
              frame: false,
              skipTaskbar: true,
              // see: https://ourcodeworld.com/articles/read/315/how-to-create-a-transparent-window-with-electron-framework
              transparent: true // backgroundColor: '#00FFFFFF',

            });

            _appState.appState.win.setSkipTaskbar(false);

            if (!(_appState.appState.appConfig.dev && _appState.appState.appConfig.dev.devTools && _appState.appState.appConfig.dev.devTools.openAtStart)) {
              _context2.next = 6;
              break;
            }

            _appState.appState.win.webContents.openDevTools({
              mode: 'undocked',
              activate: true
            });

            _context2.next = 6;
            return (0, _helpers.delay)(2000);

          case 6:
            // and load the index.html of the app.
            _appState.appState.win.loadURL(url);

            new _WindowPositioner.WindowPositioner(_appState.appState.win).move(_WindowPositioner.WindowPosition.Center);

            _appState.appState.win.webContents.on('did-finish-load', function () {
              var _context;

              _appState.appState.win.webContents.executeJavaScript("console.log('Log path:\\n" + (0, _helpers.escapeJs)((0, _filter.default)(_context = (0, _values.default)(_LoggerNode.logger.handlers)).call(_context, function (o) {
                return o.logFilePath;
              })[0].logFilePath) + "\\n')");
            });

            _LoggerNode.logger.subscribe(function (logEvent) {
              _appState.appState.win.webContents.executeJavaScript("console." + logEvent.consoleLevel + "('" + (0, _helpers.escapeJs)(logEvent.consoleString) + "')");
            });

            _appState.appState.app.on('activate', function () {
              // On macOS it's common to re-create a window in the app when the
              // dock icon is clicked and there are no other windows open.
              if (_appState.appState.win === null) {
                createWindow(url);
              } else {
                _appState.appState.win.show();
              }
            }); // region closing
            // Emitted when the window is closed.


            _appState.appState.win.on('closed', function () {
              // Dereference the window object, usually you would store windows
              // in an array if your app supports multi windows, this is the time
              // when you should delete the corresponding element.
              _appState.appState.win = null;
            });

            _appState.appState.app.on('before-quit', function () {
              _appState.appState.app.quitting = true;
            }); // Not worked:
            // appState.win.on('close', event => {
            // 	if (appState.app.quitting) {
            // 		appState.win = null
            // 	} else {
            // 		event.preventDefault()
            // 		appState.win.hide()
            // 	}
            // })
            // endregion


            (0, _tray.showTray)();

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee);
  }));
  return _createWindow.apply(this, arguments);
}