"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.Api = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _webrain = require("webrain");

var _http = require("./contracts/http");

var _helpers = require("./helpers");

var _NetworkError = require("./NetworkError");

var Api =
/*#__PURE__*/
function () {
  function Api(_ref) {
    var urlBase = _ref.urlBase,
        httpClient = _ref.httpClient;
    (0, _classCallCheck2.default)(this, Api);
    this._networkErrorSubject = new _webrain.Subject();
    this.urlBase = urlBase;
    this.httpClient = httpClient;
  } // region networkErrorObservable


  (0, _createClass2.default)(Api, [{
    key: "prepareRequest",
    // endregion
    value: function prepareRequest(request) {
      return (0, _helpers.prepareHttpRequest)(request);
    }
  }, {
    key: "sendRequest",
    value: function () {
      var _sendRequest = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(_ref2) {
        var request, errorHandler, resultHandler, response, result, apiResult, data, apiError, errorHandled;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                request = _ref2.request, errorHandler = _ref2.errorHandler, resultHandler = _ref2.resultHandler;
                _context.prev = 1;
                request = (0, _extends2.default)({}, request, {
                  headers: {}
                });
                this.prepareRequest(request);
                _context.next = 6;
                return this.httpClient.sendRequest(request);

              case 6:
                response = _context.sent;

                if (!(response.statusCode !== 200)) {
                  _context.next = 9;
                  break;
                }

                throw new _NetworkError.NetworkError({
                  message: "statusCode(" + response.statusCode + ") !== 200",
                  request: request,
                  response: response
                });

              case 9:
                _context.t0 = request.responseDataType;
                _context.next = _context.t0 === _http.HttpDataType.Json ? 12 : 14;
                break;

              case 12:
                result = JSON.parse(response.data);
                return _context.abrupt("break", 14);

              case 14:
                apiResult = {
                  result: result
                };

                if (resultHandler) {
                  resultHandler(apiResult);
                }

                return _context.abrupt("return", apiResult);

              case 19:
                _context.prev = 19;
                _context.t1 = _context["catch"](1);

                if (_context.t1 instanceof _NetworkError.NetworkError) {
                  _context.next = 24;
                  break;
                }

                console.error('Api unknown error', _context.t1, request, response);
                throw _context.t1;

              case 24:
                data = _context.t1.response && _context.t1.response.data;

                if (typeof data === 'string') {
                  try {
                    data = JSON.parse(data); // tslint:disable-next-line:no-empty
                  } catch (_unused) {}
                }

                apiError = {
                  apiError: data,
                  networkError: _context.t1
                };

                if (!(_context.t1.errorType === _http.NetworkErrorType.BadConnection)) {
                  _context.next = 30;
                  break;
                }

                console.log('Api bad connection', _context.t1, request);
                return _context.abrupt("return", {
                  error: apiError
                });

              case 30:
                errorHandled = errorHandler && errorHandler(apiError);

                if (errorHandled !== true) {
                  console.error('Api error', _context.t1, request);

                  if (errorHandled == null) {
                    this._networkErrorSubject.emit(_context.t1);
                  }
                }

                return _context.abrupt("return", {
                  error: apiError
                });

              case 33:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 19]]);
      }));

      function sendRequest(_x) {
        return _sendRequest.apply(this, arguments);
      }

      return sendRequest;
    }()
  }, {
    key: "networkErrorObservable",
    get: function get() {
      return this._networkErrorSubject;
    }
  }]);
  return Api;
}();

exports.Api = Api;