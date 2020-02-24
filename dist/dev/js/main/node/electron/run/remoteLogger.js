"use strict";

exports.__esModule = true;
exports.bindRemoteLogger = bindRemoteLogger;

var _LoggerNode = require("../../log/LoggerNode");

/* tslint:disable:no-var-requires */
// @ts-ignore
var _require = require('electron'),
    ipcMain = _require.ipcMain;

function bindRemoteLogger(logFileNameDefault) {
  ipcMain.addListener('logger_setFileName', function (event, value) {
    var handler = _LoggerNode.logger.handlers.writeToFile;
    handler.logFileName = value ? value.replace(/[^\w.\-]+/, '_') : logFileNameDefault;
  });
  ipcMain.addListener('logger_writeToFile', function (event, logEvents) {
    var handler = _LoggerNode.logger.handlers.writeToFile;

    for (var i = 0, len = logEvents.length; i < len; i++) {
      handler.enqueueLog(logEvents[i]);
    }
  });
}