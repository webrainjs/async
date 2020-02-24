"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.WriteToFileHandler = exports.path = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _contracts = require("../../common/log/contracts");

var _LogHandler2 = require("../../common/log/LogHandler");

/* tslint:disable:no-var-requires */
var fs = require('fs');

var path = require('path');

exports.path = path;

function asPromise(func) {
  return new _promise.default(function (resolve, reject) {
    return func(function (err, result) {
      if (err) {
        reject(err);
        return;
      }

      resolve(result);
    });
  });
}

function autoCutLogFile(_x, _x2, _x3) {
  return _autoCutLogFile.apply(this, arguments);
}

function _autoCutLogFile() {
  _autoCutLogFile = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(filePath, maxSize, cutToSize) {
    var stat, content;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (fs.existsSync(filePath)) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return");

          case 2:
            _context2.next = 4;
            return asPromise(function (callback) {
              return fs.stat(filePath, callback);
            });

          case 4:
            stat = _context2.sent;

            if (!(!stat.isFile() || stat.size < maxSize)) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return");

          case 7:
            _context2.next = 9;
            return asPromise(function (callback) {
              return fs.readFile(filePath, {
                encoding: 'utf8'
              }, callback);
            });

          case 9:
            content = _context2.sent;

            if (!(content.length < cutToSize)) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt("return");

          case 12:
            _context2.next = 14;
            return asPromise(function (callback) {
              return fs.writeFile(filePath, content.substring(content.length - cutToSize), {
                encoding: 'utf8'
              }, callback);
            });

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _autoCutLogFile.apply(this, arguments);
}

var WriteToFileHandler =
/*#__PURE__*/
function (_LogHandler) {
  (0, _inherits2.default)(WriteToFileHandler, _LogHandler);

  function WriteToFileHandler(logger, allowLogLevels, logDir, logFileName) {
    var _this;

    (0, _classCallCheck2.default)(this, WriteToFileHandler);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(WriteToFileHandler).call(this, {
      name: 'writeToFile',
      logger: logger,
      allowLogLevels: allowLogLevels
    }));
    _this.logDir = logDir;
    _this.logFileName = logFileName;
    return _this;
  }

  (0, _createClass2.default)(WriteToFileHandler, [{
    key: "handleLog",
    value: function () {
      var _handleLog = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(logEvents) {
        var _this2 = this;

        var logText, logFilePath, dirOutput;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                logText = (0, _map.default)(logEvents).call(logEvents, function (logEvent) {
                  return "\r\n\r\n[" + _this2._logger.appVersion + "][" + logEvent.dateString + "][" + _this2._logger.appName + "][" + _contracts.LogLevel[logEvent.level] + "]: " + logEvent.bodyString;
                }).join('');
                logFilePath = this.logFilePath;
                dirOutput = path.dirname(logFilePath);
                _context.next = 5;
                return asPromise(function (callback) {
                  return fs.mkdir(dirOutput, {
                    recursive: true
                  }, callback);
                });

              case 5:
                _context.next = 7;
                return asPromise(function (callback) {
                  return fs.appendFile(logFilePath, logText, callback);
                });

              case 7:
                _context.next = 9;
                return autoCutLogFile(logFilePath, 1000000, 500000);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function handleLog(_x4) {
        return _handleLog.apply(this, arguments);
      }

      return handleLog;
    }()
  }, {
    key: "logFilePath",
    get: function get() {
      return path.resolve(this.logDir, this.logFileName);
    }
  }]);
  return WriteToFileHandler;
}(_LogHandler2.LogHandler);

exports.WriteToFileHandler = WriteToFileHandler;