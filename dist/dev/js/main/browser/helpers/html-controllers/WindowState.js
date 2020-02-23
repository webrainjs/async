"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getWindowState = getWindowState;
exports.WindowState = void 0;

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _index = require("webrain/src/main/common/index.ts");

var _helpers = require("./helpers");

var WindowState =
/*#__PURE__*/
function (_ObservableClass) {
  (0, _inherits2.default)(WindowState, _ObservableClass);

  function WindowState(win) {
    var _context, _context2;

    var _this;

    (0, _classCallCheck2.default)(this, WindowState);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(WindowState).call(this));
    _this.win = win;

    _this.init();

    _this.onResize = (0, _bind.default)(_context = _this.onResize).call(_context, (0, _assertThisInitialized2.default)(_this));
    _this.onClose = (0, _bind.default)(_context2 = _this.onClose).call(_context2, (0, _assertThisInitialized2.default)(_this));
    (0, _bind.default)(_this).call(_this);
    return _this;
  } // region init


  (0, _createClass2.default)(WindowState, [{
    key: "init",
    value: function () {
      var _init2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.waitLoad();

              case 2:
                this._init();

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _init2.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "_init",
    value: function _init() {
      if (!this.win) {
        return;
      }

      if (typeof this.width === 'undefined') {
        this.width = this.win.outerWidth;
      }

      if (typeof this.height === 'undefined') {
        this.height = this.win.outerHeight;
      }

      this.borderWidth = this.win.outerWidth - this.win.innerWidth;
      this.borderHeight = this.win.outerHeight - this.win.innerHeight;
      console.log("Window border size: " + this.borderWidth + ", " + this.borderHeight);
    }
  }, {
    key: "_waitLoad",
    value: function () {
      var _waitLoad2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2() {
        var _this2 = this;

        return _regenerator.default.wrap(function _callee2$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return new _promise.default(function (resolve) {
                  if (!_this2.win) {
                    resolve();
                    return;
                  }

                  _this2.win.document.body.onload = resolve; // this.win.addEventListener('load', resolve, false)
                  // this.win.addEventListener('DOMContentLoaded', resolve, false)

                  if (_this2.win.document.readyState === 'complete') {
                    resolve();
                  }
                });

              case 2:
                _context4.next = 4;
                return new _promise.default(function (resolve) {
                  if (!_this2.win) {
                    resolve();
                    return;
                  }

                  _this2.win.addEventListener('resize', resolve, false);

                  if (_this2.win.innerWidth !== 0 && _this2.win.innerHeight !== 0 && _this2.win.outerWidth !== 0 && _this2.win.outerHeight !== 0) {
                    resolve();
                  }
                });

              case 4:
                this._waitLoadTask = null;

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee2, this);
      }));

      function _waitLoad() {
        return _waitLoad2.apply(this, arguments);
      }

      return _waitLoad;
    }()
  }, {
    key: "waitLoad",
    value: function () {
      var _waitLoad3 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3() {
        return _regenerator.default.wrap(function _callee3$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!this._waitLoadTask) {
                  this._waitLoadTask = this._waitLoad();
                }

                return _context5.abrupt("return", this._waitLoadTask);

              case 2:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee3, this);
      }));

      function waitLoad() {
        return _waitLoad3.apply(this, arguments);
      }

      return waitLoad;
    }() // endregion
    // region Resize

  }, {
    key: "onResize",
    value: function onResize(e) {
      var _resizeSubject = this._resizeSubject;

      if (_resizeSubject) {
        _resizeSubject.emit(e);
      }

      if (!this.win) {
        return;
      } // fix unwanted auto resize, eg. after window.moveTo()


      if (this.lastResizeTime && (0, _now.default)() - this.lastResizeTime < 1000) {
        if (this.win.outerWidth !== this.width || this.win.outerHeight !== this.height) {
          this.win.resizeTo(this.width, this.height);
        }
      } else {
        this.width = this.win.outerWidth;
        this.height = this.win.outerHeight;
        this.lastResizeTime = (0, _now.default)();
      }
    } // endregion
    // region Close

  }, {
    key: "onClose",
    value: function onClose() {
      console.log('Window closing');
      this.win = null;
      var _closeSubject = this._closeSubject;

      if (_closeSubject) {
        _closeSubject.emit(null);
      }

      console.log('Window closed');
    } // endregion
    // region methods

  }, {
    key: "show",
    value: function show() {
      if (this.isOpened) {
        if (this.win.restore) {
          this.win.restore();
        }

        this.win.focus();
      }
    }
  }, {
    key: "minimize",
    value: function minimize() {
      if (this.isOpened && this.win.minimize) {
        this.win.minimize();
      }
    }
  }, {
    key: "close",
    value: function close() {
      if (this.isOpened) {
        var win = this.win;

        try {
          this.unbind();
          this.onClose();
        } finally {
          win.close();
        }
      }
    } // endregion
    // region writable

  }, {
    key: "bind",
    // endregion
    value: function bind() {
      var _this3 = this;

      this.bindResize();
      this.win.addEventListener('beforeunload', this.onClose);

      this._setUnsubscriber('isVisible', bindVisibleChange(this.win, function (value) {
        _this3.isVisible = value;
      }));

      this._setUnsubscriber('isFocused', bindFocusChange(this.win, function (value) {
        _this3.isFocused = value;
      }));
    }
  }, {
    key: "unbind",
    value: function unbind() {
      this.unbindResize();
      this.win.removeEventListener('beforeunload', this.onClose);

      this._setUnsubscriber('isVisible', null);

      this._setUnsubscriber('isFocused', null);
    }
  }, {
    key: "bindResize",
    value: function bindResize() {
      this.win.addEventListener('resize', this.onResize);
    }
  }, {
    key: "unbindResize",
    value: function unbindResize() {
      this.win.removeEventListener('resize', this.onResize);
    }
  }, {
    key: "resizeToInner",
    value: function resizeToInner(width, height) {
      if (!this.isOpened) {
        return;
      }

      return this.resizeToOuter(width + this.borderWidth, height + this.borderHeight);
    }
  }, {
    key: "resizeToOuter",
    value: function resizeToOuter(width, height) {
      if (!this.isOpened) {
        return;
      } // chrome has window width/height limitation = 211/103px
      // see also: https://developer.mozilla.org/en-US/docs/Web/API/Window/open


      width = Math.max(211, width);
      height = Math.max(103, height);
      this.width = width;
      this.height = height;
      this.lastResizeTime = (0, _now.default)();
      return this.win.resizeTo(width, height);
    }
  }, {
    key: "resizeObservable",
    get: function get() {
      var _resizeSubject = this._resizeSubject;

      if (!_resizeSubject) {
        this._resizeSubject = _resizeSubject = new _index.Subject();
      }

      return _resizeSubject;
    }
  }, {
    key: "closeObservable",
    get: function get() {
      var _closeSubject = this._closeSubject;

      if (!_closeSubject) {
        this._closeSubject = _closeSubject = new _index.Subject();
      }

      return _closeSubject;
    }
  }, {
    key: "isOpened",
    get: function get() {
      var win = this.win;

      if ((0, _helpers.windowIsDestroyed)(win)) {
        return true;
      } else {
        this.win = null;

        if (win && win.close) {
          win.close();
        }

        return false;
      }
    }
  }]);
  return WindowState;
}(_index.ObservableClass);

exports.WindowState = WindowState;
new _index.CalcObjectBuilder(WindowState.prototype).writable('isVisible').writable('isFocused');
var WINDOW_STATE_PROPERTY_NAME = '13883806ede0481c92c41c2cda3d99c3';

function getWindowState(window) {
  if (!(0, _helpers.windowIsDestroyed)(window)) {
    return null;
  }

  var state = window[WINDOW_STATE_PROPERTY_NAME];

  if (state == null) {
    (0, _defineProperty.default)(window, WINDOW_STATE_PROPERTY_NAME, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: state = new WindowState(window)
    });
  }

  return state;
} // from: https://stackoverflow.com/a/1060034/5221762


function bindVisibleChange(window, handler) {
  /* tslint:disable:no-conditional-assignment */
  var hidden = 'hidden';
  var unsubscribe; // Standards:

  if (hidden in window.document) {
    window.document.addEventListener('visibilitychange', onchange);

    unsubscribe = function unsubscribe() {
      window.document.removeEventListener('visibilitychange', onchange);
    };
  } else if ((hidden = 'mozHidden') in window.document) {
    window.document.addEventListener('mozvisibilitychange', onchange);

    unsubscribe = function unsubscribe() {
      window.document.removeEventListener('mozvisibilitychange', onchange);
    };
  } else if ((hidden = 'webkitHidden') in window.document) {
    window.document.addEventListener('webkitvisibilitychange', onchange);

    unsubscribe = function unsubscribe() {
      window.document.removeEventListener('webkitvisibilitychange', onchange);
    };
  } else if ((hidden = 'msHidden') in window.document) {
    window.document.addEventListener('msvisibilitychange', onchange);

    unsubscribe = function unsubscribe() {
      window.document.removeEventListener('msvisibilitychange', onchange);
    };
  } else if ('onfocusin' in window.document) {
    // IE 9 and lower:
    window.document.onfocusin = window.document.onfocusout = onchange;

    unsubscribe = function unsubscribe() {
      window.document.onfocusin = window.document.onfocusout = null;
    };
  } else {
    // All others:
    window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

    unsubscribe = function unsubscribe() {
      window.onpageshow = window.onpagehide = window.onfocus = window.onblur = null;
    };
  }

  function onchange(evt) {
    var v = 'visible';
    var h = 'hidden';
    var evtMap = {
      focus: v,
      focusin: v,
      pageshow: v,
      blur: h,
      focusout: h,
      pagehide: h
    };
    evt = evt || window.event;

    if (evt.type in evtMap) {
      handler(evtMap[evt.type] === 'visible');
    } else {
      handler(!this[hidden]);
    }
  } // set the initial state (but only if browser supports the Page Visibility API)


  if (window.document[hidden] !== undefined) {
    onchange({
      type: window.document[hidden] ? 'blur' : 'focus'
    });
  }

  return unsubscribe;
}

function bindFocusChange(window, handler) {
  var onFocus = function onFocus() {
    handler(true);
  };

  var onBlur = function onBlur() {
    handler(false);
  };

  window.addEventListener('focus', onFocus);
  window.addEventListener('blur', onBlur);
  return function () {
    window.removeEventListener('focus', onFocus);
    window.removeEventListener('blur', onBlur);
  };
}