"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.logger = exports.LoggerBrowser = void 0;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _contracts = require("../../common/log/contracts");

var _EmitEventHandler = require("../../common/log/EmitEventHandler");

var _helpers = require("../../common/log/helpers");

var _Logger2 = require("../../common/log/Logger");

var _WriteToConsoleHandler = require("../../common/log/WriteToConsoleHandler");

var _SendLogHandlerBrowser = require("./SendLogHandlerBrowser");

var LoggerBrowser =
/*#__PURE__*/
function (_Logger) {
  (0, _inherits2.default)(LoggerBrowser, _Logger);

  function LoggerBrowser() {
    (0, _classCallCheck2.default)(this, LoggerBrowser);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(LoggerBrowser).apply(this, arguments));
  }

  (0, _createClass2.default)(LoggerBrowser, [{
    key: "init",
    value: function init(_ref) {
      var appName = _ref.appName,
          appVersion = _ref.appVersion,
          logUrl = _ref.logUrl,
          _ref$writeToConsoleLe = _ref.writeToConsoleLevels,
          writeToConsoleLevels = _ref$writeToConsoleLe === void 0 ? _contracts.LogLevel.Any : _ref$writeToConsoleLe,
          _ref$sendLogLevels = _ref.sendLogLevels,
          sendLogLevels = _ref$sendLogLevels === void 0 ? _contracts.LogLevel.Fatal | _contracts.LogLevel.Error | _contracts.LogLevel.Warning | _contracts.LogLevel.UserError | _contracts.LogLevel.UserWarning : _ref$sendLogLevels,
          _ref$emitEventLevels = _ref.emitEventLevels,
          emitEventLevels = _ref$emitEventLevels === void 0 ? _contracts.LogLevel.Any : _ref$emitEventLevels,
          filter = (0, _filter.default)(_ref),
          appState = _ref.appState;

      if (typeof window !== 'undefined') {
        // @ts-ignore
        var _window = window,
            unsubscribeUnhandledErrors = _window.unsubscribeUnhandledErrors;

        if (unsubscribeUnhandledErrors) {
          // @ts-ignore
          window.unsubscribeUnhandledErrors = null;
          unsubscribeUnhandledErrors();
        }
      }

      this.logUnhandledErrors();
      (0, _get2.default)((0, _getPrototypeOf2.default)(LoggerBrowser.prototype), "_init", this).call(this, {
        appName: appName,
        appVersion: appVersion,
        handlers: [new _WriteToConsoleHandler.WriteToConsoleHandler(this, writeToConsoleLevels), new _SendLogHandlerBrowser.SendLogHandlerBrowser(this, sendLogLevels, logUrl), new _EmitEventHandler.EmitEventHandler(this, emitEventLevels)],
        filter: filter,
        appState: appState
      });
    }
  }, {
    key: "logUnhandledErrors",
    value: function logUnhandledErrors() {
      var _this = this;

      var errorHandler = function errorHandler() {
        var _context;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this.error.apply(_this, (0, _concat.default)(_context = ['unhandledrejection']).call(_context, (0, _map.default)(args).call(args, function (arg) {
          return (typeof PromiseRejectionEvent !== 'undefined' ? arg instanceof PromiseRejectionEvent && arg.reason : arg.reason) || arg;
        })));
      };

      if (typeof _helpers.globalScope !== 'undefined') {
        _helpers.globalScope.addEventListener('unhandledrejection', errorHandler);

        _helpers.globalScope.onunhandledrejection = errorHandler;

        _helpers.globalScope.onerror = function () {
          var _context2;

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          _this.error.apply(_this, (0, _concat.default)(_context2 = ['unhandled error']).call(_context2, args));
        };
      }
    }
  }]);
  return LoggerBrowser;
}(_Logger2.Logger);

exports.LoggerBrowser = LoggerBrowser;
var logger = new LoggerBrowser();
exports.logger = logger;