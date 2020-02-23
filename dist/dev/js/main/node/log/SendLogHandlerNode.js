"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.SendLogHandlerNode = void 0;

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _SendLogHandler2 = require("../../common/log/SendLogHandler");

/* tslint:disable:no-var-requires */
var needle = require('needle');

var SendLogHandlerNode =
/*#__PURE__*/
function (_SendLogHandler) {
  (0, _inherits2.default)(SendLogHandlerNode, _SendLogHandler);

  function SendLogHandlerNode() {
    (0, _classCallCheck2.default)(this, SendLogHandlerNode);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(SendLogHandlerNode).apply(this, arguments));
  }

  (0, _createClass2.default)(SendLogHandlerNode, [{
    key: "sendLog",
    value: function sendLog(logUrl, message) {
      return new _promise.default(function (resolve, reject) {
        return needle.post(logUrl, message, {
          json: true,
          compressed: true,
          timeout: 20000,
          headers: {
            'X-HASH': message.Hash,
            'X-TOKEN': message.Token
          }
        }, function (err, response) {
          if (err) {
            reject(err);
            return;
          }

          resolve({
            statusCode: response.statusCode
          });
        });
      });
    }
  }]);
  return SendLogHandlerNode;
}(_SendLogHandler2.SendLogHandler);

exports.SendLogHandlerNode = SendLogHandlerNode;