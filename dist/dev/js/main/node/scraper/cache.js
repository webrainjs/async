"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.createCache = createCache;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _helpersCjs = require("./helpers-cjs");

// @ts-ignore
function hash() {
  var spark = new _helpersCjs.SparkMD5();

  for (var _len = arguments.length, objects = new Array(_len), _key = 0; _key < _len; _key++) {
    objects[_key] = arguments[_key];
  }

  spark.append((0, _stringify.default)(objects));
  return spark.end(true);
}

function getExpirableCache(cache, defaultExpiry) {
  return {
    get: function () {
      var _get = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(key, expiry) {
        var json, item;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return cache.get(key);

              case 2:
                json = _context.sent;

                if (json) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return", null);

              case 5:
                _context.prev = 5;
                item = JSON.parse(json);
                _context.next = 13;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](5);
                console.log('Error parse json: \n' + json);
                throw _context.t0;

              case 13:
                if (!expiry) {
                  expiry = defaultExpiry || -1;
                }

                if (!(expiry >= 0 && new Date().getTime() - item.createTime > expiry * 1000)) {
                  _context.next = 18;
                  break;
                }

                console.log('CACHE REMOVE: ' + key);
                cache.remove(key);
                return _context.abrupt("return", null);

              case 18:
                return _context.abrupt("return", item.value);

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[5, 9]]);
      }));

      function get(_x, _x2) {
        return _get.apply(this, arguments);
      }

      return get;
    }(),
    set: function set(key, value) {
      return cache.set(key, (0, _stringify.default)({
        createTime: new Date().getTime(),
        value: value
      }));
    },
    remove: cache.remove
  };
}

function createCache(id, expiry) {
  var diskCache = new _helpersCjs.DiskCache(id, {
    location: './tmp/cache'
  });
  var cache = {
    get: function () {
      var _get2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(key) {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return diskCache.get(key);

              case 2:
                return _context2.abrupt("return", _context2.sent.value);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function get(_x3) {
        return _get2.apply(this, arguments);
      }

      return get;
    }(),
    set: function set(key, value) {
      return diskCache.set(key, value);
    },
    remove: function remove(key) {
      return diskCache.remove(key);
    }
  };
  return getExpirableCache(cache, expiry);
}