"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.WriteToConsoleHandler = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _contracts = require("./contracts");

var _LogHandler2 = require("./LogHandler");

var _context, _context2, _context3, _context4, _context5;

var consoleOrig = {
  debug: (0, _bind.default)(_context = console.debug).call(_context, console),
  info: (0, _bind.default)(_context2 = console.info).call(_context2, console),
  log: (0, _bind.default)(_context3 = console.log).call(_context3, console),
  warn: (0, _bind.default)(_context4 = console.warn).call(_context4, console),
  error: (0, _bind.default)(_context5 = console.error).call(_context5, console)
};

var WriteToConsoleHandler =
/*#__PURE__*/
function (_LogHandler) {
  (0, _inherits2.default)(WriteToConsoleHandler, _LogHandler);

  function WriteToConsoleHandler(logger, allowLogLevels) {
    (0, _classCallCheck2.default)(this, WriteToConsoleHandler);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(WriteToConsoleHandler).call(this, {
      name: 'writeToConsole',
      logger: logger,
      allowLogLevels: allowLogLevels
    }));
  }

  (0, _createClass2.default)(WriteToConsoleHandler, [{
    key: "init",
    value: function init() {
      this.interceptConsole();
    }
  }, {
    key: "interceptConsole",
    value: function interceptConsole() {
      var self = this;

      var createInterceptFunc = function createInterceptFunc(level, consoleFunc) {
        return function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          self._logger.log({
            level: level,
            messagesOrErrors: args,
            handlersModes: {
              writeToConsole: consoleFunc ? _contracts.ActionMode.Never : _contracts.ActionMode.Default
            }
          });

          if (consoleFunc) {
            consoleFunc.apply(void 0, args);
          }
        };
      };

      console.debug = createInterceptFunc(_contracts.LogLevel.Debug, consoleOrig.debug);
      console.info = createInterceptFunc(_contracts.LogLevel.Info, consoleOrig.info);
      console.log = createInterceptFunc(_contracts.LogLevel.Info, consoleOrig.log);
      console.warn = createInterceptFunc(_contracts.LogLevel.Warning, null);
      console.error = createInterceptFunc(_contracts.LogLevel.Error, null);
    }
  }, {
    key: "handleLog",
    value: function handleLog(logEvents) {
      for (var i = 0, len = logEvents.length; i < len; i++) {
        var logEvent = logEvents[i]; // let messagesOrErrors = logEvent.messagesOrErrors
        // if (!Array.isArray(messagesOrErrors)) {
        // 	messagesOrErrors = [messagesOrErrors]
        // }

        switch (logEvent.level) {
          case _contracts.LogLevel.None:
          case _contracts.LogLevel.Trace:
          case _contracts.LogLevel.Debug:
            consoleOrig.debug(logEvent.consoleString);
            break;

          case _contracts.LogLevel.Info:
            consoleOrig.info(logEvent.consoleString);
            break;

          case _contracts.LogLevel.UserAction:
          case _contracts.LogLevel.Action:
            consoleOrig.log(logEvent.consoleString);
            break;

          case _contracts.LogLevel.UserWarning:
          case _contracts.LogLevel.UserError:
          case _contracts.LogLevel.Warning:
            consoleOrig.warn(logEvent.consoleString);
            break;

          case _contracts.LogLevel.Error:
          case _contracts.LogLevel.Fatal:
          default:
            consoleOrig.error(logEvent.consoleString);
            break;
        }
      }
    }
  }]);
  return WriteToConsoleHandler;
}(_LogHandler2.LogHandler);

exports.WriteToConsoleHandler = WriteToConsoleHandler;