"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.CombineLogHandlers = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _contracts = require("./contracts");

var CombineLogHandlers =
/*#__PURE__*/
function () {
  function CombineLogHandlers(logger) {
    (0, _classCallCheck2.default)(this, CombineLogHandlers);

    for (var _len = arguments.length, logHandlers = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      logHandlers[_key - 1] = arguments[_key];
    }

    this.name = logHandlers[0].name;
    this.logHandlers = logHandlers;
    this.allowLogLevels = _contracts.LogLevel.Any;
  }

  (0, _createClass2.default)(CombineLogHandlers, [{
    key: "init",
    value: function init() {
      for (var i = 0, len = this.logHandlers.length; i < len; i++) {
        this.logHandlers[i].init();
      }
    }
  }, {
    key: "enqueueLog",
    value: function enqueueLog(logEvent) {
      for (var i = 0, len = this.logHandlers.length; i < len; i++) {
        this.logHandlers[i].enqueueLog(logEvent);
      }
    }
  }]);
  return CombineLogHandlers;
}();

exports.CombineLogHandlers = CombineLogHandlers;