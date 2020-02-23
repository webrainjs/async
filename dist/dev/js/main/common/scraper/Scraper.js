"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.Scraper = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _index = require("webrain/src/main/common/index.ts");

var _helpers = require("../api/helpers");

var _NetworkError = require("../api/NetworkError");

var Scraper =
/*#__PURE__*/
function () {
  function Scraper(_ref) {
    var urlBase = _ref.urlBase,
        httpClient = _ref.httpClient;
    (0, _classCallCheck2.default)(this, Scraper);
    this._networkErrorSubject = new _index.Subject();
    this.urlBase = urlBase;
    this.httpClient = httpClient;
  } // region networkErrorObservable


  (0, _createClass2.default)(Scraper, [{
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
        var request, checkStatusCode, response;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                request = _ref2.request, checkStatusCode = _ref2.checkStatusCode;
                _context.prev = 1;
                request = (0, _extends2.default)({}, request, {
                  headers: {}
                });
                this.prepareRequest(request);
                _context.next = 6;
                return this.httpClient.sendRequest(request);

              case 6:
                response = _context.sent;

                if (!(checkStatusCode ? !checkStatusCode(response.statusCode) : response.statusCode !== 200)) {
                  _context.next = 9;
                  break;
                }

                throw new _NetworkError.NetworkError({
                  message: "statusCode(" + response.statusCode + ") !== 200",
                  request: request,
                  response: response
                });

              case 9:
                return _context.abrupt("return", {
                  response: response
                });

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](1);

                if (_context.t0 instanceof _NetworkError.NetworkError) {
                  _context.next = 17;
                  break;
                }

                console.error('Scraper unknown error', _context.t0, request, response);
                throw _context.t0;

              case 17:
                console.error('Scraper error', _context.t0, request);

                this._networkErrorSubject.emit(_context.t0);

                return _context.abrupt("return", {
                  error: _context.t0
                });

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 12]]);
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
  return Scraper;
}();

exports.Scraper = Scraper;