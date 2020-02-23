"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var sapper = _interopRequireWildcard(require("SAPPER_MODULE/server"));

var _APP_CONFIG_PATH = _interopRequireDefault(require("APP_CONFIG_PATH"));

var _compression = _interopRequireDefault(require("compression"));

var _express = _interopRequireDefault(require("express"));

var _sirv = _interopRequireDefault(require("sirv"));

var _path = _interopRequireDefault(require("path"));

var _contracts = require("./main/common/log/contracts");

var _LoggerNode = require("./main/node/log/LoggerNode");

require("./styles/index.jss");

/* eslint-disable no-process-env */
// noinspection NpmUsedModulesInstalled
// noinspection NpmUsedModulesInstalled
// import polka from 'polka'
_LoggerNode.logger.init({
  appName: _APP_CONFIG_PATH.default.appName,
  appVersion: _APP_CONFIG_PATH.default.appVersion,
  logUrl: _APP_CONFIG_PATH.default.logUrl,
  appState: (0, _extends2.default)({}, _APP_CONFIG_PATH.default),
  logFilePath: _path.default.resolve('tmp/logs/sapper.txt'),
  writeToFileLevels: _contracts.LogLevel.Any
});

var dev = _APP_CONFIG_PATH.default.sapper.buildMode === 'development'; // const isExport = process.env.npm_lifecycle_event === 'build:sapper:export'
// if (isExport) {
// 	console.log('Export mode')
// }

console.log('PORT=', process.env.PORT);
console.log('NODE_ENV=', process.env.NODE_ENV);
var server = (0, _express.default)();
server.disable('x-powered-by');
server.use('/app', (0, _compression.default)({
  threshold: 0
}), (0, _sirv.default)('static', {
  dev: dev
}), sapper.middleware()).listen(_APP_CONFIG_PATH.default.sapper.port, function (err) {
  if (err) {
    console.log('error', err);
  }
});