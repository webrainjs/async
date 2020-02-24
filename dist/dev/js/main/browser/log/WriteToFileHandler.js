"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.WriteToFileHandler = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _contracts = require("../../common/log/contracts");

var _LogHandler2 = require("../../common/log/LogHandler");

/* tslint:disable:no-var-requires */
var WriteToFileHandler =
/*#__PURE__*/
function (_LogHandler) {
  (0, _inherits2.default)(WriteToFileHandler, _LogHandler);

  function WriteToFileHandler(logger, allowLogLevels, logFileName) {
    var _this;

    (0, _classCallCheck2.default)(this, WriteToFileHandler);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(WriteToFileHandler).call(this, {
      name: 'writeToFile',
      logger: logger,
      allowLogLevels: allowLogLevels
    }));
    _this._logFileName = logFileName;
    return _this;
  }

  (0, _createClass2.default)(WriteToFileHandler, [{
    key: "handleLog",
    value: function () {
      var _handleLog = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(logEvents) {
        var remoteLogger, sendLogEvents;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                remoteLogger = typeof window !== 'undefined' ? window.remoteLogger : null;

                if (remoteLogger) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return");

              case 3:
                sendLogEvents = (0, _map.default)(logEvents).call(logEvents, function (o) {
                  return {
                    level: o.level,
                    dateString: o.dateString,
                    appInfo: o.appInfo,
                    handlersModes: {
                      _all: _contracts.ActionMode.Never,
                      writeToFile: _contracts.ActionMode.Always
                    },
                    bodyString: o.bodyString
                  };
                });
                _context.next = 6;
                return remoteLogger.writeToFile.apply(remoteLogger, sendLogEvents);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function handleLog(_x) {
        return _handleLog.apply(this, arguments);
      }

      return handleLog;
    }()
  }, {
    key: "logFileName",
    get: function get() {
      return this._logFileName;
    },
    set: function set(value) {
      this._logFileName = value;
      console.log("logFileName = " + this._logFileName);

      if (typeof window !== 'undefined' && window.remoteLogger) {
        window.remoteLogger.setFileName(value);
      }
    }
  }]);
  return WriteToFileHandler;
}(_LogHandler2.LogHandler);

exports.WriteToFileHandler = WriteToFileHandler;