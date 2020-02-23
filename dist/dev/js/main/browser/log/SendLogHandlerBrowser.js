"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.SendLogHandlerBrowser = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _SendLogHandler2 = require("../../common/log/SendLogHandler");

/* tslint:disable:no-var-requires */
function sendXhr(logUrl, message, selfError) {
  return new _promise.default(function (resolve, reject) {
    // construct an HTTP request
    var xhr = new XMLHttpRequest();

    xhr.onerror = function () {
      selfError.apply(void 0, arguments);
    };

    xhr.open('POST', logUrl, true);
    xhr.timeout = 20000;
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.setRequestHeader('X-HASH', message.Hash);
    xhr.setRequestHeader('X-TOKEN', message.Token); // xhr.setRequestHeader('Accept-Encoding', 'gzip, deflate')
    // xhr.setRequestHeader('Content-Encoding', 'gzip')

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        resolve({
          statusCode: xhr.status
        });
      }
    };

    xhr.send((0, _stringify.default)(message));
  });
}

function sendFetch(logUrl, message) {
  return fetch(logUrl, {
    method: 'POST',
    mode: 'cors',
    // no-cors, cors, *same-origin
    cache: 'no-cache',
    // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin',
    // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-HASH': message.Hash,
      'X-TOKEN': message.Token
    },
    redirect: 'follow',
    // manual, *follow, error
    referrer: 'no-referrer',
    // no-referrer, *client
    body: (0, _stringify.default)(message) // body data type must match "Content-Type" header

  }).then(function (response) {
    return {
      statusCode: response.status
    };
  });
}

var SendLogHandlerBrowser =
/*#__PURE__*/
function (_SendLogHandler) {
  (0, _inherits2.default)(SendLogHandlerBrowser, _SendLogHandler);

  function SendLogHandlerBrowser() {
    (0, _classCallCheck2.default)(this, SendLogHandlerBrowser);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(SendLogHandlerBrowser).apply(this, arguments));
  }

  (0, _createClass2.default)(SendLogHandlerBrowser, [{
    key: "sendLog",
    value: function sendLog() {
      return typeof XMLHttpRequest !== 'undefined' ? sendFetch.apply(void 0, arguments) : sendFetch.apply(void 0, arguments);
    }
  }]);
  return SendLogHandlerBrowser;
}(_SendLogHandler2.SendLogHandler);

exports.SendLogHandlerBrowser = SendLogHandlerBrowser;