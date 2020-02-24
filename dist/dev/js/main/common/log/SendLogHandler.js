"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.SendLogHandler = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _reverse = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reverse"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _extends3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _contracts = require("./contracts");

var _helpers = require("./helpers");

var _LogHandler2 = require("./LogHandler");

var SendLogHandler =
/*#__PURE__*/
function (_LogHandler) {
  (0, _inherits2.default)(SendLogHandler, _LogHandler);

  function SendLogHandler(logger, allowLogLevels, logUrl) {
    var _this;

    (0, _classCallCheck2.default)(this, SendLogHandler);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(SendLogHandler).call(this, {
      name: 'sendLog',
      logger: logger,
      allowLogLevels: allowLogLevels,
      throttleTime: 1000
    }));
    _this.logUrl = logUrl;
    return _this;
  }

  (0, _createClass2.default)(SendLogHandler, [{
    key: "handleLog",
    value: function () {
      var _handleLog = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(logEvents) {
        var _this2 = this,
            _context;

        var logUrl, lastLogEvent, selfError, errorWasWrite, body, token, message, delayTime, maxDelayTime, _ref, statusCode;

        return _regenerator.default.wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                logUrl = this.logUrl;

                if (!(!logUrl || !logUrl.length)) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return");

              case 3:
                lastLogEvent = logEvents[logEvents.length - 1];

                selfError = function selfError() {
                  var _extends2;

                  for (var _len = arguments.length, messagesOrErrors = new Array(_len), _key = 0; _key < _len; _key++) {
                    messagesOrErrors[_key] = arguments[_key];
                  }

                  _this2._logger.log({
                    level: _contracts.LogLevel.Error,
                    messagesOrErrors: messagesOrErrors,
                    handlersModes: (0, _extends3.default)({}, lastLogEvent.handlersModes, (_extends2 = {}, _extends2[_this2.name] = _contracts.ActionMode.Never, _extends2))
                  });
                };

                errorWasWrite = false;
                body = (0, _map.default)(_context = (0, _reverse.default)(logEvents).call(logEvents)).call(_context, function (logEvent, index) {
                  return (0, _helpers.escapeHtml)("[" + logEvent.dateString + "][" + _this2._logger.appName + "][" + logEvent.level + "][" + index + "]: " + logEvent.bodyString + "\r\n\r\nAppInfo: " + logEvent.appInfo);
                }).join('\r\n<hr>\r\n');
                body = lastLogEvent.md5Hash + '\r\n' + '\r\n' + body;
                token = (0, _helpers.md5)(lastLogEvent.md5Hash + '607bf405-a5a8-4b8c-aa61-41e8c1208dba');
                message = {
                  Token: token,
                  Hash: lastLogEvent.md5Hash,
                  AppName: this._logger.appName,
                  AppVersion: this._logger.appVersion,
                  Type: _contracts.LogLevel[lastLogEvent.level],
                  Time: lastLogEvent.time.toISOString(),
                  MessageFull: body,
                  MessageShort: (0, _helpers.removeExcessSpaces)(lastLogEvent.messagesString.substring(0, 200))
                };
                delayTime = 10000;
                maxDelayTime = 300000;

              case 12:
                if (!true) {
                  _context2.next = 32;
                  break;
                }

                _context2.prev = 13;
                _context2.next = 16;
                return this.sendLog(logUrl, message, selfError);

              case 16:
                _ref = _context2.sent;
                statusCode = _ref.statusCode;

                if (!(statusCode === 200)) {
                  _context2.next = 20;
                  break;
                }

                return _context2.abrupt("return");

              case 20:
                if (statusCode === 429 || statusCode === 502 || statusCode === 504) {
                  console.log('Send log failed: Bad Connection');
                } else if (!errorWasWrite) {
                  errorWasWrite = true;
                  selfError('Send log status code == ' + statusCode);
                }

                _context2.next = 26;
                break;

              case 23:
                _context2.prev = 23;
                _context2.t0 = _context2["catch"](13);
                console.log('Send log failed: Bad Connection'); // if (!errorWasWrite) {
                // 	errorWasWrite = true
                // 	selfError('Send log error', error)
                // }

              case 26:
                _context2.next = 28;
                return (0, _helpers.delay)(delayTime);

              case 28:
                delayTime = delayTime * 2;

                if (delayTime > maxDelayTime) {
                  delayTime = maxDelayTime;
                }

                _context2.next = 12;
                break;

              case 32:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee, this, [[13, 23]]);
      }));

      function handleLog(_x) {
        return _handleLog.apply(this, arguments);
      }

      return handleLog;
    }()
  }]);
  return SendLogHandler;
}(_LogHandler2.LogHandler);

exports.SendLogHandler = SendLogHandler;