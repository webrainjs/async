"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.FetchHttpClient = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _http = require("../../common/api/contracts/http");

var _NetworkError = require("../../common/api/NetworkError");

function fetchExt(_x, _x2) {
  return _fetchExt.apply(this, arguments);
}

function _fetchExt() {
  _fetchExt = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(url, options) {
    var controller, signal, timeout, timeoutId;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Abort by timeout
            controller = new AbortController();
            signal = controller.signal;
            timeout = options.timeout || 60000;
            timeoutId = (0, _setTimeout2.default)(function () {
              console.debug('Fetch aborted by timeout: ' + timeout);
              controller.abort();
            }, timeout);
            _context2.prev = 4;
            _context2.next = 7;
            return fetch(url, (0, _extends2.default)({}, options, {
              signal: signal
            }));

          case 7:
            return _context2.abrupt("return", _context2.sent);

          case 8:
            _context2.prev = 8;
            clearTimeout(timeoutId);
            return _context2.finish(8);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4,, 8, 11]]);
  }));
  return _fetchExt.apply(this, arguments);
}

var FetchHttpClient =
/*#__PURE__*/
function () {
  function FetchHttpClient() {
    (0, _classCallCheck2.default)(this, FetchHttpClient);
  }

  (0, _createClass2.default)(FetchHttpClient, [{
    key: "sendRequest",
    value: function () {
      var _sendRequest = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(request) {
        var response, data;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return fetchExt(request.url, {
                  timeout: request.timeout,
                  method: request.method,
                  headers: request.headers,
                  cache: request.cache ? 'default' : 'no-cache',
                  // *default, no-cache, reload, force-cache, only-if-cached
                  body: request.data,
                  // body data type must match "Content-Type" header
                  mode: 'cors',
                  // no-cors, cors, *same-origin
                  // credentials: 'same-origin', // include, *same-origin, omit
                  redirect: 'error',
                  // manual, *follow, error
                  referrer: '' // no-referrer, *client

                });

              case 3:
                response = _context.sent;
                _context.t0 = request.responseDataType;
                _context.next = _context.t0 === _http.HttpDataType.String ? 7 : _context.t0 === _http.HttpDataType.Json ? 7 : 11;
                break;

              case 7:
                _context.next = 9;
                return response.text();

              case 9:
                data = _context.sent;
                return _context.abrupt("break", 12);

              case 11:
                throw new Error('Unknown dataType: ' + request.responseDataType);

              case 12:
                return _context.abrupt("return", {
                  statusCode: response.status,
                  data: data,
                  originalResponse: response
                });

              case 15:
                _context.prev = 15;
                _context.t1 = _context["catch"](0);
                throw new _NetworkError.NetworkError({
                  message: 'Init fetch error',
                  request: request,
                  error: _context.t1
                });

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 15]]);
      }));

      function sendRequest(_x3) {
        return _sendRequest.apply(this, arguments);
      }

      return sendRequest;
    }()
  }]);
  return FetchHttpClient;
}();

exports.FetchHttpClient = FetchHttpClient;