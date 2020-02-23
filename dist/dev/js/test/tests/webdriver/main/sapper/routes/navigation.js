"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _endsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/ends-with"));

/* eslint-disable function-paren-newline */
var _intern$getInterface = intern.getInterface('object'),
    registerSuite = _intern$getInterface.registerSuite;

var _intern$getPlugin = intern.getPlugin('chai'),
    assert = _intern$getPlugin.assert;

function errorPredicate(log) {
  var message = typeof log === 'string' ? log : log.message;

  if (typeof message !== 'string') {
    return true;
  }

  if ((0, _endsWith.default)(message).call(message, '0:0 Uncaught (in promise) AbortError: Failed to register a ServiceWorker: ServiceWorker script evaluation failed') || (0, _endsWith.default)(message).call(message, 'Unhandled rejection: ')) {
    return false;
  }

  if ((0, _indexOf.default)(message).call(message, '__sapper__') >= 0) {
    return false;
  }

  return true;
}

registerSuite('main > sapper > routes > navigation', {
  'base': function base() {
    var _this = this;

    // docs:
    // https://theintern.io/docs.html#Leadfoot/2/api/Command/command-1
    // https://theintern.io/leadfoot/module-leadfoot_Command.html
    // this.timeout = 180000
    function clickAll(command, selector, delayMs) {
      if (delayMs === void 0) {
        delayMs = 100;
      }

      return command.findAllByCssSelector(selector).then(
      /*#__PURE__*/
      function () {
        var _ref = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee(items) {
          var _iterator, _isArray, _i, _ref2, item;

          return _regenerator.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _iterator = items, _isArray = (0, _isArray2.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);

                case 1:
                  if (!_isArray) {
                    _context.next = 7;
                    break;
                  }

                  if (!(_i >= _iterator.length)) {
                    _context.next = 4;
                    break;
                  }

                  return _context.abrupt("break", 18);

                case 4:
                  _ref2 = _iterator[_i++];
                  _context.next = 11;
                  break;

                case 7:
                  _i = _iterator.next();

                  if (!_i.done) {
                    _context.next = 10;
                    break;
                  }

                  return _context.abrupt("break", 18);

                case 10:
                  _ref2 = _i.value;

                case 11:
                  item = _ref2;
                  _context.next = 14;
                  return item.click();

                case 14:
                  _context.next = 16;
                  return delay(delayMs);

                case 16:
                  _context.next = 1;
                  break;

                case 18:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }()).end();
    }

    return this.remote // .delay(60000)
    // .getCurrentWindowHandle()
    .openWindow(425, 882).openWindow(425, 882).getWithInternPort('/app/dev').testPage(function () {
      return _this.remote.testNavigate(null, function (o) {
        return o.pathname;
      }, '/app/dev/components/', 2000);
    }, errorPredicate);
  }
});