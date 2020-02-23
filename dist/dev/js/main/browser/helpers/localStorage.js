"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.storeWindowState = storeWindowState;
exports.storeObject = storeObject;
exports.localStorageWrapper = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _index = require("webrain/src/main/common/index.ts");

/* tslint:disable:no-empty */
var localStorageWrapper = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local && {
  getItem: function getItem(key) {
    return new _promise.default(function (resolve) {
      chrome.storage.local.get([key], function (result) {
        return resolve(result[key]);
      });
    });
  },
  setItem: function setItem(key, value) {
    return new _promise.default(function (resolve) {
      var _chrome$storage$local;

      chrome.storage.local.set((_chrome$storage$local = {}, _chrome$storage$local[key] = value, _chrome$storage$local), resolve);
    });
  }
} || typeof localStorage !== 'undefined' && localStorage || null;
exports.localStorageWrapper = localStorageWrapper;

function storeWindowState(_x, _x2) {
  return _storeWindowState.apply(this, arguments);
}

function _storeWindowState() {
  _storeWindowState = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(name, win) {
    var storageKey, stateStr, state, saveState;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            storageKey = "window-state-" + name;
            _context2.next = 3;
            return localStorageWrapper.getItem(storageKey);

          case 3:
            stateStr = _context2.sent;
            state = stateStr && JSON.parse(stateStr);

            if (state) {
              win.moveTo(state.x, state.y);
              win.resizeTo(state.width, state.height);
            }

            saveState =
            /*#__PURE__*/
            function () {
              var _ref = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee() {
                return _regenerator.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return localStorageWrapper.setItem(storageKey, (0, _stringify.default)({
                          x: win.screenLeft,
                          y: win.screenTop,
                          width: win.outerWidth,
                          height: win.outerHeight
                        }));

                      case 2:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function saveState() {
                return _ref.apply(this, arguments);
              };
            }();

            win.addEventListener('resize', saveState, false);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _storeWindowState.apply(this, arguments);
}

function storeObject(_x3, _x4, _x5) {
  return _storeObject.apply(this, arguments);
}

function _storeObject() {
  _storeObject = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(storageKey, object, ruleBuilder) {
    var serializedStr, serialized, deferredSave;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!(typeof window === 'undefined')) {
              _context4.next = 2;
              break;
            }

            return _context4.abrupt("return", null);

          case 2:
            _context4.next = 4;
            return localStorageWrapper.getItem(storageKey);

          case 4:
            serializedStr = _context4.sent;

            if (serializedStr) {
              serialized = JSON.parse(serializedStr);

              _index.ObjectSerializer.default.deSerialize(serialized, {
                valueFactory: function valueFactory() {
                  return object;
                }
              });
            }

            deferredSave = new _index.DeferredCalc(function () {
              this.calc();
            },
            /*#__PURE__*/
            function () {
              var _ref2 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee3(done) {
                var serialized;
                return _regenerator.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        // tslint:disable-next-line:no-shadowed-variable
                        serialized = _index.ObjectSerializer.default.serialize(object);
                        _context3.next = 3;
                        return localStorageWrapper.setItem(storageKey, (0, _stringify.default)(serialized));

                      case 3:
                        done();

                      case 4:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x6) {
                return _ref2.apply(this, arguments);
              };
            }(), function () {}, {
              throttleTime: 1000,
              maxThrottleTime: 10000,
              minTimeBetweenCalc: 5000
            });
            return _context4.abrupt("return", (0, _index.deepSubscribe)({
              object: object,
              changeValue: function changeValue() {
                deferredSave.invalidate();
              },
              ruleBuilder: ruleBuilder
            }));

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _storeObject.apply(this, arguments);
}