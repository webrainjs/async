"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.init = init;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _contracts = require("../../../common/log/contracts");

var _LoggerNode = require("../../log/LoggerNode");

var _server = require("../helpers/server");

var _appState = require("./appState");

var _mainWindow = require("./mainWindow");

/* tslint:disable:no-var-requires */
// @ts-ignore
var path = require('path');

var _require = require('electron'),
    ipcMain = _require.ipcMain;

function init(app, appConfig, prepareStartUrl) {
  _appState.appState.app = app;
  _appState.appState.appConfig = appConfig;
  ipcMain.on('app-config', function (event) {
    event.returnValue = _appState.appState.appConfig;
  }); // app.setPath('userData', path.resolve(process.cwd(), 'tmp/electron/userData'))

  _LoggerNode.logger.init({
    appName: _appState.appState.appConfig.appName,
    appVersion: _appState.appState.appConfig.appVersion,
    logUrl: _appState.appState.appConfig.logUrl,
    appState: (0, _extends2.default)({}, _appState.appState.appConfig),
    logFilePath: path.resolve(_appState.appState.app.getPath('userData'), 'logs/log.txt'),
    writeToFileLevels: _contracts.LogLevel.Any
  });

  _LoggerNode.logger.debug('resourcesPath = ' + (0, _server.getResourcesPath)(_appState.appState.app));

  _LoggerNode.logger.debug('rootPath = ' + (0, _server.getRootPath)(_appState.appState.app));

  process.chdir((0, _server.getRootPath)(_appState.appState.app));

  _appState.appState.app.enableSandbox();

  var url = prepareStartUrl(); // const protocolName = 'app'
  // appState.app.setAsDefaultProtocolClient(protocolName)
  // serveStatic(appState.app, protocolName, 'localhost', `dist/${appState.appConfig.type}/sapper/export`)
  // const url = protocolName + '://localhost/app/dev/gmap'

  var createWindow = function createWindow() {
    return (0, _mainWindow.createWindow)(url);
  }; // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.


  _appState.appState.app.on('ready', function () {
    createWindow();
  });

  _appState.appState.app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      _appState.appState.app.quit();
    }
  });
}