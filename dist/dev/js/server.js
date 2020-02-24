"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _startsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/starts-with"));

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
try {
  _LoggerNode.logger.init({
    appName: _APP_CONFIG_PATH.default.appName,
    appVersion: _APP_CONFIG_PATH.default.appVersion,
    logUrls: _APP_CONFIG_PATH.default.logUrls,
    logDir: _path.default.resolve('tmp/logs'),
    logFileName: 'server.log',
    appState: (0, _extends2.default)({}, _APP_CONFIG_PATH.default),
    writeToFileLevels: _contracts.LogLevel.Any
  });
} catch (ex) {
  console.log(ex);
  throw ex;
}

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
}), // Fix sapper template.html for Chrome App
function (req, res, next) {
  var end = res.end;

  res.end = function (body) {
    var _context;

    if (typeof body === 'string' && (0, _startsWith.default)(body).call(body, '<!doctype')) {
      body = body.replace(/navigator\.serviceWorker\.register\(['"][\w/]+\/service-worker\.js['"]\);?/g, ' { try { $& } catch (ex) { console.log(ex.message) } } ');
    }

    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    return end.call.apply(end, (0, _concat.default)(_context = [this, body]).call(_context, rest));
  };

  next();
}, sapper.middleware()).listen(_APP_CONFIG_PATH.default.sapper.port, function (err) {
  if (err) {
    console.log('error', err);
  }
});