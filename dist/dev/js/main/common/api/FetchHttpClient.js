"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.FetchHttpClient = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _webrain = require("webrain");

var _http = require("./contracts/http");

var _NetworkError = require("./NetworkError");

function getCachedResponse(url, body) {
  if (!body) {
    return null;
  }

  return _promise.default.resolve({
    ok: true,
    url: url,
    status: 200,
    statusText: 'OK',
    json: function json() {
      return _promise.default.resolve(JSON.parse(body));
    },
    text: function text() {
      return _promise.default.resolve(body);
    } // textConverted: () => Promise.resolve(body),

  });
}

var FetchHttpClient =
/*#__PURE__*/
function () {
  function FetchHttpClient(_ref) {
    var _ref$fetch = _ref.fetch,
        _fetch = _ref$fetch === void 0 ? fetch : _ref$fetch;

    (0, _classCallCheck2.default)(this, FetchHttpClient);
    this._loadingSubject = new _webrain.Subject();
    this._loadedSubject = new _webrain.Subject();
    this._errorSubject = new _webrain.Subject();
    this._fetch = _fetch;
  } // region events
  // region loading


  (0, _createClass2.default)(FetchHttpClient, [{
    key: "fetchExt",
    // endregion
    // endregion
    value: function () {
      var _fetchExt = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(url, options) {
        var _this = this;

        var key, data, fetchFunc, response, _data;

        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;

                if (!options.cache) {
                  _context2.next = 10;
                  break;
                }

                key = url + '\n' + (0, _stringify.default)(options);
                _context2.next = 5;
                return options.cache.get(key, options.cache && options.cache.expiry);

              case 5:
                data = _context2.sent;

                if (!data) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 9;
                return getCachedResponse(url, data);

              case 9:
                return _context2.abrupt("return", _context2.sent);

              case 10:
                fetchFunc =
                /*#__PURE__*/
                function () {
                  var _ref2 = (0, _asyncToGenerator2.default)(
                  /*#__PURE__*/
                  _regenerator.default.mark(function _callee() {
                    var controller, signal, timeout, timeoutId, res;
                    return _regenerator.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _this._loadingSubject.emit({
                              url: url,
                              options: options
                            }); // Abort by timeout


                            controller = new AbortController();
                            signal = controller.signal;
                            timeout = options.timeout || 60000;
                            timeoutId = (0, _setTimeout2.default)(function () {
                              console.debug('Fetch aborted by timeout: ' + timeout);
                              controller.abort();
                            }, timeout);
                            _context.prev = 5;
                            _context.next = 8;
                            return _this._fetch(url, options.fetch);

                          case 8:
                            res = _context.sent;

                          case 9:
                            _context.prev = 9;
                            clearTimeout(timeoutId);
                            return _context.finish(9);

                          case 12:
                            _this._loadedSubject.emit({
                              url: url,
                              options: options,
                              response: res
                            });

                            return _context.abrupt("return", res);

                          case 14:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, null, [[5,, 9, 12]]);
                  }));

                  return function fetchFunc() {
                    return _ref2.apply(this, arguments);
                  };
                }();

                _context2.next = 13;
                return options.timeLimit ? options.timeLimit.run(fetchFunc) : fetchFunc();

              case 13:
                response = _context2.sent;

                if (!options.cache) {
                  _context2.next = 22;
                  break;
                }

                _context2.next = 17;
                return response // .clone()
                .text();

              case 17:
                _data = _context2.sent;
                options.cache.set(key, _data);
                _context2.next = 21;
                return getCachedResponse(url, _data);

              case 21:
                return _context2.abrupt("return", _context2.sent);

              case 22:
                return _context2.abrupt("return", response);

              case 25:
                _context2.prev = 25;
                _context2.t0 = _context2["catch"](0);

                this._errorSubject.emit({
                  url: url,
                  options: options,
                  error: _context2.t0
                });

                throw _context2.t0;

              case 29:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 25]]);
      }));

      function fetchExt(_x, _x2) {
        return _fetchExt.apply(this, arguments);
      }

      return fetchExt;
    }()
  }, {
    key: "sendRequest",
    value: function () {
      var _sendRequest = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3(request) {
        var response, data;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this.fetchExt(request.url, {
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
                response = _context3.sent;
                _context3.t0 = request.responseDataType;
                _context3.next = _context3.t0 === _http.HttpDataType.String ? 7 : _context3.t0 === _http.HttpDataType.Json ? 7 : 11;
                break;

              case 7:
                _context3.next = 9;
                return response.text();

              case 9:
                data = _context3.sent;
                return _context3.abrupt("break", 12);

              case 11:
                throw new Error('Unknown dataType: ' + request.responseDataType);

              case 12:
                return _context3.abrupt("return", {
                  statusCode: response.status,
                  data: data,
                  originalResponse: response
                });

              case 15:
                _context3.prev = 15;
                _context3.t1 = _context3["catch"](0);
                throw new _NetworkError.NetworkError({
                  message: 'Init fetch error',
                  request: request,
                  error: _context3.t1
                });

              case 18:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 15]]);
      }));

      function sendRequest(_x3) {
        return _sendRequest.apply(this, arguments);
      }

      return sendRequest;
    }()
  }, {
    key: "loadingObservable",
    get: function get() {
      return this._loadingSubject;
    } // endregion
    // region loaded

  }, {
    key: "loadedObservable",
    get: function get() {
      return this._loadedSubject;
    } // endregion
    // region error

  }, {
    key: "errorObservable",
    get: function get() {
      return this._errorSubject;
    }
  }]);
  return FetchHttpClient;
}();

exports.FetchHttpClient = FetchHttpClient;