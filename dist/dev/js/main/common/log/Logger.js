"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.Logger = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _contracts = require("./contracts");

var _helpers = require("./helpers");

var _LogEvent = require("./LogEvent");

/* tslint:disable:no-var-requires */
// region Logger
var Logger =
/*#__PURE__*/
function () {
  function Logger() {
    (0, _classCallCheck2.default)(this, Logger);
    this.minTimeBetweenEqualEvents = 120000;
    this._logEventsTime = {};
    this._subscribers = [];
  }

  (0, _createClass2.default)(Logger, [{
    key: "_init",
    value: function _init(_ref) {
      var appName = _ref.appName,
          appVersion = _ref.appVersion,
          handlers = _ref.handlers,
          filter = (0, _filter.default)(_ref),
          appState = _ref.appState;

      if (this._initialized) {
        this.error('Logger already initialized');
        return;
      }

      this._initialized = true;
      this.appName = appName;
      this.appVersion = appVersion;
      this.handlers = handlers;
      this.filter = filter;
      this.appState = appState;
      this.interceptEval();
      var logEvent = {
        level: _contracts.LogLevel.Info,
        messagesOrErrors: "Start App: " + appName + " v" + appVersion,
        handlersModes: {}
      };

      if (this.handlers) {
        for (var i = 0; i < this.handlers.length; i++) {
          var handler = handlers[i];

          if (handler) {
            logEvent.handlersModes[handler.name] = _contracts.ActionMode.Always;
            handler.init();
          }
        }
      }

      this.log(logEvent);
    }
  }, {
    key: "interceptEval",
    value: function interceptEval() {
      var _this = this;

      var oldEval = _helpers.globalScope.eval;
      delete _helpers.globalScope.eval;

      _helpers.globalScope.eval = function (str) {
        if ((0, _indexOf.default)(str).call(str, 'async function') >= 0) {
          return oldEval.call(_helpers.globalScope, str);
        }

        try {
          return oldEval.call(_helpers.globalScope, str);
        } catch (ex) {
          _this.error('eval error', ex, str);

          throw ex;
        }
      };
    } // endregion
    // region log interface

  }, {
    key: "debug",
    value: function debug() {
      for (var _len = arguments.length, messagesOrErrors = new Array(_len), _key = 0; _key < _len; _key++) {
        messagesOrErrors[_key] = arguments[_key];
      }

      this.log({
        level: _contracts.LogLevel.Debug,
        messagesOrErrors: messagesOrErrors
      });
    }
  }, {
    key: "info",
    value: function info() {
      for (var _len2 = arguments.length, messagesOrErrors = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        messagesOrErrors[_key2] = arguments[_key2];
      }

      this.log({
        level: _contracts.LogLevel.Info,
        messagesOrErrors: messagesOrErrors
      });
    }
  }, {
    key: "action",
    value: function action() {
      for (var _len3 = arguments.length, messagesOrErrors = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        messagesOrErrors[_key3] = arguments[_key3];
      }

      this.log({
        level: _contracts.LogLevel.Action,
        messagesOrErrors: messagesOrErrors
      });
    }
  }, {
    key: "warn",
    value: function warn() {
      for (var _len4 = arguments.length, messagesOrErrors = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        messagesOrErrors[_key4] = arguments[_key4];
      }

      this.log({
        level: _contracts.LogLevel.Warning,
        messagesOrErrors: messagesOrErrors
      });
    }
  }, {
    key: "error",
    value: function error() {
      for (var _len5 = arguments.length, messagesOrErrors = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        messagesOrErrors[_key5] = arguments[_key5];
      }

      this.log({
        level: _contracts.LogLevel.Error,
        messagesOrErrors: messagesOrErrors
      });
    }
  }, {
    key: "log",
    value: function log(logEventOrLevel) {
      if (logEventOrLevel != null && typeof logEventOrLevel === 'object') {
        this._log(logEventOrLevel instanceof _LogEvent.LogEvent ? logEventOrLevel : this.createLogEvent(logEventOrLevel));
      } else {
        for (var _len6 = arguments.length, messagesOrErrors = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
          messagesOrErrors[_key6 - 1] = arguments[_key6];
        }

        this._log(this.createLogEvent({
          level: logEventOrLevel,
          messagesOrErrors: messagesOrErrors
        }));
      }
    } // endregion
    // region log handlers

  }, {
    key: "createLogEvent",
    value: function createLogEvent(params) {
      params.appState = (0, _extends2.default)({
        appName: this.appName,
        appVersion: this.appVersion
      }, this.appState);
      return new _LogEvent.LogEvent(params);
    }
  }, {
    key: "_log",
    value: function _log(logEvent) {
      var filter = (0, _filter.default)(this);

      if (filter && !filter(logEvent)) {
        return;
      }

      var _logEventsTime = this._logEventsTime;
      var time = _logEventsTime[logEvent.bodyString];

      if (time != null && time + this.minTimeBetweenEqualEvents > logEvent.time.getTime()) {
        return;
      }

      _logEventsTime[logEvent.bodyString] = logEvent.time.getTime();
      var handlers = this.handlers;

      for (var i = 0; i < handlers.length; i++) {
        var handler = handlers[i];

        if (handler) {
          handler.enqueueLog(logEvent);
        }
      }
    } // endregion
    // region log event

  }, {
    key: "subscribe",
    value: function subscribe(subscriber) {
      var _this2 = this;

      this._subscribers.push(subscriber);

      return function () {
        var _context;

        var index = (0, _indexOf.default)(_context = _this2._subscribers).call(_context, subscriber);

        if (index >= 0) {
          var _context2;

          (0, _splice.default)(_context2 = _this2._subscribers).call(_context2, index, 1);
        }
      };
    }
  }, {
    key: "onLog",
    value: function () {
      var _onLog = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(logEvent) {
        var i;
        return _regenerator.default.wrap(function _callee$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this._subscribers.length) {
                  _context3.next = 8;
                  break;
                }

                i = 0;

              case 2:
                if (!(i < this._subscribers.length)) {
                  _context3.next = 8;
                  break;
                }

                _context3.next = 5;
                return this._subscribers[i](logEvent);

              case 5:
                i++;
                _context3.next = 2;
                break;

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee, this);
      }));

      function onLog(_x) {
        return _onLog.apply(this, arguments);
      }

      return onLog;
    }() // endregion

  }]);
  return Logger;
}(); // endregion


exports.Logger = Logger;