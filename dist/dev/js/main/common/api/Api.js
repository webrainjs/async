"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.Api = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _startsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/starts-with"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _url = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/url"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _webrain = require("webrain");

var _api = require("./contracts/api");

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
    this._isBadConnection = false;
    this._networkEventSubject = new _webrain.Subject();
    this.urlBase = urlBase;
    this.httpClient = httpClient;
  }

  (0, _createClass2.default)(Api, [{
    key: "prepareRequest",
    // endregion
    value: function prepareRequest(request) {
      if (request.method !== 'GET' && (request.data || request.dataType)) {
        switch (request.dataType) {
          case _http.HttpDataType.FormUrlEncoded:
            request.data = (0, _helpers.toFormUrlEncoded)(request.data);
            request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            break;

          case _http.HttpDataType.MultipartFormData:
            request.data = (0, _helpers.toFormData)(request.data); // request.headers['Content-Type'] = 'multipart/form-data; boundary="d0987012-5c8b-471d-b79b-81fabac23628"'

            break;

          case _http.HttpDataType.Json:
            request.data = (0, _stringify.default)(request.data);
            request.headers['Content-Type'] = 'application/json; charset=UTF-8';
            break;

          default:
            throw new Error('Unknown dataType: ' + request.dataType);
        }
      }

      switch (request.responseDataType) {
        case _http.HttpDataType.String:
          request.headers.Accept = 'text/plain';
          break;

        case _http.HttpDataType.Json:
          request.headers.Accept = 'application/json';
          break;

        default:
          throw new Error('Unknown dataType: ' + request.responseDataType);
      }

      if (this.urlBase) {
        request.url = new _url.default(request.url, this.urlBase).href;
      }
    }
  }, {
    key: "sendRequest",
    value: function () {
      var _sendRequest = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(_ref2) {
        var request, errorHandler, resultHandler, response, _context, result, apiResult, data, apiError, errorHandled;

        return _regenerator.default.wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                request = _ref2.request, errorHandler = _ref2.errorHandler, resultHandler = _ref2.resultHandler;
                _context2.prev = 1;
                request = (0, _extends2.default)({}, request, {
                  headers: {}
                });
                this.prepareRequest(request);
                _context2.next = 6;
                return this.httpClient.sendRequest(request);

              case 6:
                response = _context2.sent;
                this.isBadConnection = false;

                if (!(response.statusCode !== 200)) {
                  _context2.next = 10;
                  break;
                }

                throw new _NetworkError.NetworkError({
                  message: "statusCode(" + response.statusCode + ") !== 200",
                  request: request,
                  response: response
                });

              case 10:
                this._networkEventSubject.emit({
                  type: _api.NetworkEventType.Success,
                  data: {
                    fromBaseUrl: (0, _startsWith.default)(_context = request.url.toLowerCase()).call(_context, (this.urlBase || '').toLowerCase()),
                    request: request,
                    response: response
                  }
                });

                _context2.t0 = request.responseDataType;
                _context2.next = _context2.t0 === _http.HttpDataType.Json ? 14 : 16;
                break;

              case 14:
                result = JSON.parse(response.data);
                return _context2.abrupt("break", 16);

              case 16:
                apiResult = {
                  result: result
                };

                if (resultHandler) {
                  resultHandler(apiResult);
                }

                return _context2.abrupt("return", apiResult);

              case 21:
                _context2.prev = 21;
                _context2.t1 = _context2["catch"](1);

                if (_context2.t1 instanceof _NetworkError.NetworkError) {
                  _context2.next = 26;
                  break;
                }

                console.error('Api unknown error', _context2.t1, request, response);
                throw _context2.t1;

              case 26:
                if (!(_context2.t1.errorType === _http.NetworkErrorType.BadConnection)) {
                  _context2.next = 30;
                  break;
                }

                this.isBadConnection = true;

                this._networkEventSubject.emit({
                  type: _api.NetworkEventType.Error,
                  data: _context2.t1
                });

                return _context2.abrupt("return", {
                  error: {
                    networkError: _context2.t1
                  }
                });

              case 30:
                this.isBadConnection = false;
                data = _context2.t1.response && _context2.t1.response.data;

                if (typeof data === 'string') {
                  try {
                    data = JSON.parse(data); // tslint:disable-next-line:no-empty
                  } catch (_unused) {}
                }

                apiError = {
                  apiError: data,
                  networkError: _context2.t1
                };
                errorHandled = errorHandler && errorHandler(apiError);

                if (errorHandled !== true) {
                  console.error('Api error', _context2.t1, request);

                  if (errorHandled == null) {
                    this._networkEventSubject.emit({
                      type: _api.NetworkEventType.Error,
                      data: _context2.t1
                    });
                  }
                }

                return _context2.abrupt("return", {
                  error: apiError
                });

              case 37:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee, this, [[1, 21]]);
      }));

      function sendRequest(_x) {
        return _sendRequest.apply(this, arguments);
      }

      return sendRequest;
    }()
  }, {
    key: "isBadConnection",
    get: function get() {
      return this._isBadConnection;
    },
    set: function set(value) {
      if (this._isBadConnection === value) {
        return;
      }

      this._isBadConnection = value;
      console.log(value ? 'Bad Connection' : 'Connection Restored');
    } // region networkEventObservable

  }, {
    key: "networkEventObservable",
    get: function get() {
      return this._networkEventSubject;
    }
  }]);
  return Api;
}();

exports.Api = Api;