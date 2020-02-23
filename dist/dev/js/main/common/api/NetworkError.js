"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.NetworkError = void 0;

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/wrapNativeSuper"));

var _http = require("./contracts/http");

var NetworkError =
/*#__PURE__*/
function (_Error) {
  (0, _inherits2.default)(NetworkError, _Error);

  function NetworkError(args) {
    var _this;

    (0, _classCallCheck2.default)(this, NetworkError);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(NetworkError).call(this));
    (0, _assign.default)((0, _assertThisInitialized2.default)(_this), args);
    return _this;
  }

  (0, _createClass2.default)(NetworkError, [{
    key: "toString",
    value: function toString() {
      var buffer = [];

      if (this.statusCode) {
        buffer.push('StatusCode: ');
        buffer.push(this.statusCode);
      }

      if (this.message) {
        buffer.push(this.message);
      }

      if (this.error) {
        buffer.push(this.error.toString());
      }

      if (!buffer.length) {
        buffer.push('Unknown error');
      }

      return buffer.join('\r\n');
    }
  }, {
    key: "statusCode",
    get: function get() {
      return this.response && this.response.statusCode;
    }
  }, {
    key: "errorType",
    get: function get() {
      var _errorType = this._errorType;

      if (typeof _errorType === 'undefined') {
        var statusCode = this.statusCode;

        if (!statusCode || statusCode === 429 || statusCode === 502 || statusCode === 504) {
          _errorType = _http.NetworkErrorType.BadConnection;
        } else if (statusCode === 307 || statusCode === 451 || statusCode === 403) {
          _errorType = _http.NetworkErrorType.UnauthorizedOrLoggedOff;
        } else if (statusCode && 500 <= statusCode && statusCode < 600) {
          _errorType = _http.NetworkErrorType.TemporaryUnavailable;
        } else {
          _errorType = null;
        }

        this._errorType = _errorType;
      }

      return _errorType;
    }
  }]);
  return NetworkError;
}((0, _wrapNativeSuper2.default)(Error));

exports.NetworkError = NetworkError;