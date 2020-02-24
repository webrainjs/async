"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.logger = exports.LoggerBrowser = void 0;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _construct2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/construct"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _CombineLogHandlers = require("../../common/log/CombineLogHandlers");

var _contracts = require("../../common/log/contracts");

var _EmitEventHandler = require("../../common/log/EmitEventHandler");

var _helpers = require("../../common/log/helpers");

var _Logger2 = require("../../common/log/Logger");

var _WriteToConsoleHandler = require("../../common/log/WriteToConsoleHandler");

var _SendLogHandlerBrowser = require("./SendLogHandlerBrowser");

var _WriteToFileHandler = require("./WriteToFileHandler");

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
      var _context,
          _this = this;

      var appName = _ref.appName,
          appVersion = _ref.appVersion,
          logUrls = _ref.logUrls,
          logFileName = _ref.logFileName,
          _ref$writeToFileLevel = _ref.writeToFileLevels,
          writeToFileLevels = _ref$writeToFileLevel === void 0 ? _contracts.LogLevel.Any : _ref$writeToFileLevel,
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
        handlers: [new _WriteToConsoleHandler.WriteToConsoleHandler(this, writeToConsoleLevels), logUrls && logUrls.length && (0, _construct2.default)(_CombineLogHandlers.CombineLogHandlers, (0, _concat.default)(_context = [this]).call(_context, (0, _map.default)(logUrls).call(logUrls, function (logUrl) {
          return new _SendLogHandlerBrowser.SendLogHandlerBrowser(_this, sendLogLevels, logUrl);
        }))), new _EmitEventHandler.EmitEventHandler(this, emitEventLevels), new _WriteToFileHandler.WriteToFileHandler(this, writeToFileLevels, logFileName)],
        filter: filter,
        appState: appState
      });
    }
  }, {
    key: "logUnhandledErrors",
    value: function logUnhandledErrors() {
      var _this2 = this;

      var errorHandler = function errorHandler() {
        var _context2;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this2.error.apply(_this2, (0, _concat.default)(_context2 = ['unhandledrejection']).call(_context2, (0, _map.default)(args).call(args, function (arg) {
          return (typeof PromiseRejectionEvent !== 'undefined' ? arg instanceof PromiseRejectionEvent && arg.reason : arg.reason) || arg;
        })));
      };

      if (typeof _helpers.globalScope !== 'undefined') {
        _helpers.globalScope.addEventListener('unhandledrejection', errorHandler);

        _helpers.globalScope.onunhandledrejection = errorHandler;

        _helpers.globalScope.onerror = function () {
          var _context3;

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          _this2.error.apply(_this2, (0, _concat.default)(_context3 = ['unhandled error']).call(_context3, args));
        };
      }
    }
  }]);
  return LoggerBrowser;
}(_Logger2.Logger);

exports.LoggerBrowser = LoggerBrowser;
var logger = new LoggerBrowser();
exports.logger = logger;