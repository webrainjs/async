"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.LogEvent = void 0;

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _contracts = require("./contracts");

var _helpers = require("./helpers");

var _objectToString = require("./objectToString");

// tslint:disable-next-line:no-var-requires
function getStackTraceCountFrames(level) {
  switch (level) {
    case _contracts.LogLevel.Error:
      return 50;

    case _contracts.LogLevel.Fatal:
      return 100;

    case _contracts.LogLevel.UserError:
      return 10;

    case _contracts.LogLevel.UserWarning:
      return 10;

    case _contracts.LogLevel.Warning:
      return 5;
  }

  return 0;
}

var LogEvent =
/*#__PURE__*/
function () {
  // region constructor
  function LogEvent(_ref) {
    var level = _ref.level,
        messagesOrErrors = _ref.messagesOrErrors,
        handlersModes = _ref.handlersModes,
        time = _ref.time,
        stack = _ref.stack,
        additionalHashString = _ref.additionalHashString,
        appState = _ref.appState;
    (0, _classCallCheck2.default)(this, LogEvent);
    this.level = level || _contracts.LogLevel.Error;
    this.messagesOrErrors = messagesOrErrors;
    this.handlersModes = handlersModes;
    this.time = time || new Date(); // TODO - need UTC

    this.stack = stack;
    this.additionalHashString = additionalHashString;
    this.appState = appState;

    if (!this.stack) {
      var stackTraceCountFrames = getStackTraceCountFrames(this.level);

      if (stackTraceCountFrames > 0) {
        this.stack = new Error('StackTrace').stack;
      }
    }
  } // endregion
  // region calculable
  // region messages


  (0, _createClass2.default)(LogEvent, [{
    key: "messages",
    get: function get() {
      if (this._messages == null) {
        var _context, _context2;

        this._messages = this.messagesOrErrors ? (0, _map.default)(_context = (0, _filter.default)(_context2 = (0, _isArray.default)(this.messagesOrErrors) ? this.messagesOrErrors : [this.messagesOrErrors]).call(_context2, function (o) {
          return !(o instanceof Error);
        })).call(_context, function (o) {
          return o ? typeof o === 'object' ? (0, _objectToString.objectToString)(o) : o.toString() : o + '';
        }) : [];
      }

      return this._messages;
    }
  }, {
    key: "messagesString",
    get: function get() {
      if (this._messagesString == null) {
        this._messagesString = this.messages.join('\r\n\r\n');
      }

      return this._messagesString;
    } // endregion
    // region errors

  }, {
    key: "errors",
    get: function get() {
      if (this._errors == null) {
        var _context3;

        this._errors = this.messagesOrErrors ? (0, _filter.default)(_context3 = (0, _isArray.default)(this.messagesOrErrors) ? this.messagesOrErrors : [this.messagesOrErrors]).call(_context3, function (o) {
          return o instanceof Error;
        }) : [];
      }

      return this._errors;
    }
  }, {
    key: "errorsString",
    get: function get() {
      if (this._errorsString == null) {
        var _context4;

        this._errorsString = (0, _map.default)(_context4 = this.errors).call(_context4, _objectToString.objectToString).join('\r\n\r\n');
      }

      return this._errorsString;
    } // endregion
    // region console

  }, {
    key: "consoleLevel",
    get: function get() {
      switch (this.level) {
        case _contracts.LogLevel.None:
        case _contracts.LogLevel.Trace:
        case _contracts.LogLevel.Debug:
          return 'debug';

        case _contracts.LogLevel.Info:
          return 'info';

        case _contracts.LogLevel.UserAction:
        case _contracts.LogLevel.Action:
          return 'log';

        case _contracts.LogLevel.UserWarning:
        case _contracts.LogLevel.UserError:
        case _contracts.LogLevel.Warning:
          return 'warn';

        case _contracts.LogLevel.Error:
        case _contracts.LogLevel.Fatal:
        default:
          return 'error';
      }
    }
  }, {
    key: "consoleString",
    get: function get() {
      if (this._consoleString == null) {
        this._consoleString = "\r\n[" + this.dateString + "][" + _contracts.LogLevel[this.level] + "]: " + this.bodyString;
      }

      return this._consoleString;
    } // endregion
    // region time

  }, {
    key: "dateString",
    get: function get() {
      if (this._timeString == null) {
        this._timeString = this.time.toISOString().replace('T', ' ').replace('Z', '');
      }

      return this._timeString;
    } // endregion
    // region stack

  }, {
    key: "stackString",
    get: function get() {
      if (this._stackString == null) {
        this._stackString = this.stack || '';
      }

      return this._stackString;
    } // endregion
    // region appInfo

  }, {
    key: "appInfo",
    get: function get() {
      if (this._appInfo == null) {
        var appState = this.appState;
        this._appInfo = appState ? (0, _stringify.default)(appState, null, 4) : '';
      }

      return this._appInfo;
    } // endregion
    // region md5Hash

  }, {
    key: "md5Hash",
    get: function get() {
      if (!this._md5Hash) {
        var buffer = [];

        if (this.additionalHashString) {
          buffer.push(this.additionalHashString);
        }

        if (this.errorsString) {
          buffer.push(this.errorsString.toString());
        }

        if (this.stack) {
          buffer.push(this.stack);
        }

        if (this.appInfo) {
          buffer.push(this.appInfo);
        } // if (!buffer.length && this.messagesString) {
        // 	buffer.push(this.messagesString)
        // }


        var hashString = buffer.join('\r\n');
        this._md5Hash = (0, _helpers.md5)(hashString);
      }

      return this._md5Hash;
    } // endregion
    // region bodyString

  }, {
    key: "bodyString",
    get: function get() {
      if (!this._bodyString) {
        var buffer = [];

        if (this.messagesString) {
          buffer.push(this.messagesString);
        }

        if (this.errorsString) {
          buffer.push(this.errorsString);
        }

        if (this.stackString) {
          buffer.push(this.stackString);
        }

        this._bodyString = buffer.join('\r\n\r\n');
      }

      return this._bodyString;
    } // endregion
    // endregion

  }]);
  return LogEvent;
}();

exports.LogEvent = LogEvent;