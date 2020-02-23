"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.EmitEventHandler = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _LogHandler2 = require("./LogHandler");

var EmitEventHandler =
/*#__PURE__*/
function (_LogHandler) {
  (0, _inherits2.default)(EmitEventHandler, _LogHandler);

  function EmitEventHandler(logger, allowLogLevels) {
    (0, _classCallCheck2.default)(this, EmitEventHandler);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(EmitEventHandler).call(this, {
      name: 'emitEvent',
      logger: logger,
      allowLogLevels: allowLogLevels
    }));
  }

  (0, _createClass2.default)(EmitEventHandler, [{
    key: "handleLog",
    value: function () {
      var _handleLog = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(logEvents) {
        var i, len;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                i = 0, len = logEvents.length;

              case 1:
                if (!(i < len)) {
                  _context.next = 7;
                  break;
                }

                _context.next = 4;
                return this._logger.onLog(logEvents[i]);

              case 4:
                i++;
                _context.next = 1;
                break;

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function handleLog(_x) {
        return _handleLog.apply(this, arguments);
      }

      return handleLog;
    }()
  }]);
  return EmitEventHandler;
}(_LogHandler2.LogHandler);

exports.EmitEventHandler = EmitEventHandler;