"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _LoggerBrowser = require("./main/browser/log/LoggerBrowser");

var _APP_CONFIG_PATH = _interopRequireDefault(require("APP_CONFIG_PATH"));

// noinspection NpmUsedModulesInstalled
_LoggerBrowser.logger.init({
  appName: _APP_CONFIG_PATH.default.appName,
  appVersion: _APP_CONFIG_PATH.default.appVersion,
  logUrl: _APP_CONFIG_PATH.default.logUrl,
  appState: (0, _extends2.default)({}, _APP_CONFIG_PATH.default),
  filter: function filter(logEvent) {
    if (logEvent.messagesOrErrors && logEvent.messagesOrErrors.length) {
      var first = logEvent.messagesOrErrors[0];

      if (first) {
        var _context;

        if (first.target && typeof first.target.url === 'string' && (0, _indexOf.default)(_context = first.target.url).call(_context, '__sapper__') >= 0) {
          return false;
        }
      }
    }

    return true;
  }
});