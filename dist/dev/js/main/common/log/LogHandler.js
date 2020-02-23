"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.canDoAction = canDoAction;
exports.handleLogErrorHandler = handleLogErrorHandler;
exports.LogHandler = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _contracts = require("./contracts");

var _helpers = require("./helpers");

function canDoAction(actionMode, allowedLevels, level) {
  return actionMode === _contracts.ActionMode.Always || actionMode !== _contracts.ActionMode.Never && (allowedLevels & level) !== 0;
}

var LogHandler =
/*#__PURE__*/
function () {
  function LogHandler(_ref) {
    var name = _ref.name,
        logger = _ref.logger,
        allowLogLevels = _ref.allowLogLevels,
        maxQueueSize = _ref.maxQueueSize,
        throttleMaxQueueSize = _ref.throttleMaxQueueSize,
        throttleTime = _ref.throttleTime;
    (0, _classCallCheck2.default)(this, LogHandler);
    this._queue = [];
    this.name = name;
    this._logger = logger;
    this.allowLogLevels = allowLogLevels || _contracts.LogLevel.Any;
    this._maxQueueSize = maxQueueSize || 10;
    this._throttleMaxQueueSize = throttleMaxQueueSize || 5;
    this._throttleTime = throttleTime || 0;
  }

  (0, _createClass2.default)(LogHandler, [{
    key: "init",
    value: function init() {}
  }, {
    key: "canLog",
    value: function canLog(logEvent) {
      return canDoAction(logEvent.handlersModes ? logEvent.handlersModes[this.name] || _contracts.ActionMode.Default : _contracts.ActionMode.Default, this.allowLogLevels, logEvent.level);
    }
  }, {
    key: "onError",
    value: function onError(logEvents, error) {
      var _this = this;

      handleLogErrorHandler(logEvents, error, this._logger, function (newLogEvent) {
        if (!newLogEvent.handlersModes) {
          newLogEvent.handlersModes = {};
        }

        newLogEvent.handlersModes[_this.name] = _contracts.ActionMode.Never;
      });
    }
  }, {
    key: "enqueueLog",
    value: function enqueueLog(logEvent) {
      var canLog = this.canLog(logEvent);

      while (this._queue.length > this._maxQueueSize && !this.canLog(this._queue[0])) {
        this._queue.shift();
      }

      this._queue.push(logEvent);

      if (!canLog || this._inProcess) {
        return;
      } // noinspection JSIgnoredPromiseFromCall


      this.handleLogs();
    }
  }, {
    key: "handleLogs",
    value: function () {
      var _handleLogs = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        var _this2 = this;

        var _context, _context2, _logEvents;

        return _regenerator.default.wrap(function _callee$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this._inProcess) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return");

              case 2:
                _context3.prev = 2;

              case 3:
                if (!(this._throttleTime && this._queue.length < this._throttleMaxQueueSize)) {
                  _context3.next = 6;
                  break;
                }

                _context3.next = 6;
                return (0, _helpers.delay)(this._throttleTime);

              case 6:
                if (this._queue.length) {
                  _context3.next = 8;
                  break;
                }

                return _context3.abrupt("break", 18);

              case 8:
                _logEvents = (0, _splice.default)(_context2 = this._queue).call(_context2, 0);
                _context3.prev = 9;
                _context3.next = 12;
                return this.handleLog(_logEvents);

              case 12:
                _context3.next = 17;
                break;

              case 14:
                _context3.prev = 14;
                _context3.t0 = _context3["catch"](9);
                this.onError(_logEvents, _context3.t0);

              case 17:
                if ((0, _some.default)(_context = this._queue).call(_context, function (o) {
                  return _this2.canLog(o);
                })) {
                  _context3.next = 3;
                  break;
                }

              case 18:
                _context3.prev = 18;
                this._inProcess = false;
                return _context3.finish(18);

              case 21:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee, this, [[2,, 18, 21], [9, 14]]);
      }));

      function handleLogs() {
        return _handleLogs.apply(this, arguments);
      }

      return handleLogs;
    }()
  }]);
  return LogHandler;
}();

exports.LogHandler = LogHandler;

function handleLogErrorHandler(logEvents, error, logger, changeNewLogEvent) {
  var _changeNewLogEvent = function _changeNewLogEvent(newLogEvent) {
    changeNewLogEvent(newLogEvent);
    return newLogEvent;
  }; // for (let i = 0, len = logEvents.length; i < len; i++) {
  // 	const logEvent = logEvents[i]
  // 	logger.log(_changeNewLogEvent({
  // 		level: logEvent.level,
  // 		message: logEvent.message,
  // 		error: logEvent.error,
  // 		stack: logEvent.stack,
  // 		time: logEvent.time,
  // 		writeConsoleMode: logEvent.writeConsoleMode,
  // 		sendLogMode: logEvent.sendLogMode,
  // 		writeFileMode: logEvent.writeFileMode,
  // 	}))
  // }


  var lastLogEvent = logEvents[logEvents.length - 1];
  logger.log(_changeNewLogEvent({
    level: _contracts.LogLevel.Error,
    messagesOrErrors: ['Logger self error', error],
    handlersModes: lastLogEvent.handlersModes
  }));
}