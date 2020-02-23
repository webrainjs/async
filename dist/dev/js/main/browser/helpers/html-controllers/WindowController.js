"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.windowIsDestroyed = windowIsDestroyed;
exports.createWindowController = createWindowController;
exports.getWindowController = getWindowController;
exports.WindowControllerFactory = exports.WindowController = exports.WindowSizeController = void 0;

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _webrain = require("webrain");

var _localStorage = require("../localStorage");

function windowIsDestroyed(win) {
  try {
    return !win || win.closed || !win.document;
  } catch (ex) {
    return true;
  }
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

var WindowSizeController =
/*#__PURE__*/
function () {
  function WindowSizeController(winController) {
    (0, _classCallCheck2.default)(this, WindowSizeController);
    this.winController = winController;
  }

  (0, _createClass2.default)(WindowSizeController, [{
    key: "init",
    value: function () {
      var _init = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        var _context;

        return _regenerator.default.wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.winController.waitLoad();

              case 2:
                if (this.winController.isOpened) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt("return");

              case 4:
                (0, _bind.default)(_context = this).call(_context);

                if (typeof this.width === 'undefined') {
                  this.width = this.winController.win.outerWidth;
                }

                if (typeof this.height === 'undefined') {
                  this.height = this.winController.win.outerHeight;
                }

                this.borderWidth = this.winController.win.outerWidth - this.winController.win.innerWidth;
                this.borderHeight = this.winController.win.outerHeight - this.winController.win.innerHeight;
                console.log("Window border size: " + this.borderWidth + ", " + this.borderHeight);

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "bind",
    value: function bind() {
      var _this = this;

      if (!this.winController.isOpened) {
        return;
      }

      this.winController.resizeObservable.subscribe(function () {
        if (!_this.winController.isOpened) {
          return;
        } // fix unwanted auto resize, eg. after window.moveTo()


        if (_this.lastResizeTime && (0, _now.default)() - _this.lastResizeTime < 1000) {
          if (_this.winController.win.outerWidth !== _this.width || _this.winController.win.outerHeight !== _this.height) {
            _this.winController.win.resizeTo(_this.width, _this.height);
          }
        } else {
          _this.width = _this.winController.win.outerWidth;
          _this.height = _this.winController.win.outerHeight;
          _this.lastResizeTime = (0, _now.default)();
        }
      });
    } // region methods

  }, {
    key: "resizeToInner",
    value: function resizeToInner(width, height) {
      if (!this.winController.isOpened) {
        return;
      }

      return this.resizeToOuter(width + this.borderWidth, height + this.borderHeight);
    }
  }, {
    key: "resizeToOuter",
    value: function resizeToOuter(width, height) {
      if (!this.winController.isOpened) {
        return;
      } // chrome has window width/height limitation = 211/103px
      // see also: https://developer.mozilla.org/en-US/docs/Web/API/Window/open


      width = Math.max(211, width);
      height = Math.max(103, height);
      this.width = width;
      this.height = height;
      this.lastResizeTime = (0, _now.default)();
      return this.winController.win.resizeTo(width, height);
    } // endregion

  }]);
  return WindowSizeController;
}();

exports.WindowSizeController = WindowSizeController;

var WindowController =
/*#__PURE__*/
function (_ObservableClass) {
  (0, _inherits2.default)(WindowController, _ObservableClass);

  function WindowController(_ref) {
    var _this2;

    var windowName = _ref.windowName,
        win = _ref.win,
        _ref$storeWindowState = _ref.storeWindowState,
        _storeWindowState = _ref$storeWindowState === void 0 ? true : _ref$storeWindowState;

    (0, _classCallCheck2.default)(this, WindowController);
    _this2 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(WindowController).call(this));
    _this2.windowName = windowName;
    _this2.win = win;
    _this2._storeWindowState = _storeWindowState;
    _this2.sizeController = new WindowSizeController((0, _assertThisInitialized2.default)(_this2));

    _this2.init();

    return _this2;
  } // region State


  (0, _createClass2.default)(WindowController, [{
    key: "_waitLoad",
    // endregion
    // region waitLoad
    value: function () {
      var _waitLoad2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2() {
        var _this3 = this;

        return _regenerator.default.wrap(function _callee2$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return new _promise.default(function (resolve) {
                  if (!_this3.win) {
                    resolve();
                    return;
                  }

                  _this3.win.document.body.onload = resolve; // this.win.addEventListener('load', resolve, false)
                  // this.win.addEventListener('DOMContentLoaded', resolve, false)

                  if (_this3.win.document.readyState === 'complete') {
                    resolve();
                  }
                });

              case 2:
                _context3.next = 4;
                return new _promise.default(function (resolve) {
                  if (!_this3.win) {
                    resolve();
                    return;
                  }

                  _this3.win.addEventListener('resize', resolve, false);

                  if (_this3.win.innerWidth !== 0 && _this3.win.innerHeight !== 0 && _this3.win.outerWidth !== 0 && _this3.win.outerHeight !== 0) {
                    resolve();
                  }
                });

              case 4:
                this._waitLoadTask = null;

              case 5:
              case "end":
                return _context3.stop();
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
        return _regenerator.default.wrap(function _callee3$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!this._waitLoadTask) {
                  this._waitLoadTask = this._waitLoad();
                }

                return _context4.abrupt("return", this._waitLoadTask);

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee3, this);
      }));

      function waitLoad() {
        return _waitLoad3.apply(this, arguments);
      }

      return waitLoad;
    }() // endregion
    // region init

  }, {
    key: "init",
    value: function () {
      var _init2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee4() {
        return _regenerator.default.wrap(function _callee4$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.waitLoad();

              case 2:
                _context5.next = 4;
                return this._init();

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee4, this);
      }));

      function init() {
        return _init2.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "_init",
    value: function () {
      var _init3 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee5() {
        var _context6;

        return _regenerator.default.wrap(function _callee5$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (this.win) {
                  _context7.next = 2;
                  break;
                }

                return _context7.abrupt("return");

              case 2:
                if (!this._storeWindowState) {
                  _context7.next = 5;
                  break;
                }

                _context7.next = 5;
                return (0, _localStorage.storeWindowState)(this.windowName, this.win);

              case 5:
                (0, _bind.default)(_context6 = this).call(_context6);
                _context7.next = 8;
                return this.sizeController.init();

              case 8:
                this.onLoad();

              case 9:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee5, this);
      }));

      function _init() {
        return _init3.apply(this, arguments);
      }

      return _init;
    }() // endregion
    // region onLoad

  }, {
    key: "onLoad",
    value: function onLoad() {
      if (this.isLoaded || !this.isOpened) {
        return;
      }

      this.isLoaded = true;
      console.log('Window loaded');
      var _loadSubject = this._loadSubject;

      if (_loadSubject) {
        _loadSubject.emit(null);
      }
    } // endregion
    // region onClose

  }, {
    key: "onClose",
    value: function onClose() {
      if (!this.isOpened) {
        return;
      }

      this.isClosing = true;
      this.unbind();
      console.log('Window closing');
      var _closeSubject = this._closeSubject;

      if (_closeSubject) {
        _closeSubject.emit(null);
      }

      console.log('Window closed');
    } // endregion
    // region onResize

  }, {
    key: "onResize",
    value: function onResize(e) {
      if (!this.isOpened) {
        return;
      }

      var _resizeSubject = this._resizeSubject;

      if (_resizeSubject) {
        _resizeSubject.emit(e);
      }
    } // endregion
    // region bind / unbind events

  }, {
    key: "bind",
    value: function bind() {
      var _this4 = this;

      if (!this.isOpened) {
        return;
      }

      this.win.addEventListener('beforeunload', function () {
        _this4.onClose();

        return false;
      });
      this.win.addEventListener('resize', function (e) {
        _this4.onResize(e);
      });

      this._setUnsubscriber('isVisible', bindVisibleChange(this.win, function (value) {
        _this4.isVisible = value;
      }));

      this._setUnsubscriber('isFocused', bindFocusChange(this.win, function (value) {
        _this4.isFocused = value;
      }));
    }
  }, {
    key: "unbind",
    value: function unbind() {
      if (this.isDestroyed) {
        return;
      }

      this.win.removeEventListener('beforeunload', this.onClose);
      this.win.removeEventListener('resize', this.onClose);

      this._setUnsubscriber('isVisible', null);

      this._setUnsubscriber('isFocused', null);
    } // endregion
    // region methods

  }, {
    key: "show",
    value: function show() {
      if (!this.isOpened) {
        return;
      }

      if (this.win.restore) {
        this.win.restore();
      }

      this.win.focus();
    }
  }, {
    key: "minimize",
    value: function minimize() {
      if (!this.isOpened) {
        return;
      }

      if (this.win.minimize) {
        this.win.minimize();
      }
    }
  }, {
    key: "close",
    value: function close() {
      if (!this.isOpened) {
        return;
      }

      var win = this.win;

      try {
        this.onClose();
      } finally {
        win.close();
      }
    } // endregion

  }, {
    key: "isDestroyed",
    get: function get() {
      var win = this.win;

      if (!windowIsDestroyed(win)) {
        return false;
      } else {
        if (win && win.close) {
          win.close();
        }

        return true;
      }
    }
  }, {
    key: "isOpened",
    get: function get() {
      return !this.isDestroyed && !this.isClosing;
    }
  }, {
    key: "loadObservable",
    get: function get() {
      var _loadSubject = this._loadSubject;

      if (!_loadSubject) {
        this._loadSubject = _loadSubject = new _webrain.BehaviorSubject();
      }

      return _loadSubject;
    }
  }, {
    key: "closeObservable",
    get: function get() {
      var _closeSubject = this._closeSubject;

      if (!_closeSubject) {
        this._closeSubject = _closeSubject = new _webrain.BehaviorSubject();
      }

      return _closeSubject;
    }
  }, {
    key: "resizeObservable",
    get: function get() {
      var _resizeSubject = this._resizeSubject;

      if (!_resizeSubject) {
        this._resizeSubject = _resizeSubject = new _webrain.Subject();
      }

      return _resizeSubject;
    }
  }]);
  return WindowController;
}(_webrain.ObservableClass);

exports.WindowController = WindowController;
new _webrain.CalcObjectBuilder(WindowController.prototype).writable('isVisible').writable('isFocused');
var WINDOW_STATE_PROPERTY_NAME = '13883806ede0481c92c41c2cda3d99c3';

function createWindowController(options) {
  if (windowIsDestroyed(options.win)) {
    return null;
  }

  var controller = options.win[WINDOW_STATE_PROPERTY_NAME];

  if (controller) {
    throw new Error('Window controller already created');
  }

  (0, _defineProperty.default)(options.win, WINDOW_STATE_PROPERTY_NAME, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: controller = new WindowController(options)
  });
  return controller;
}

function getWindowController(win) {
  if (windowIsDestroyed(win)) {
    return null;
  }

  return win[WINDOW_STATE_PROPERTY_NAME];
}

var WindowControllerFactory =
/*#__PURE__*/
function () {
  // resizable=no is not worked in browsers because: https://stackoverflow.com/a/15481333/5221762
  function WindowControllerFactory(_ref2) {
    var windowName = _ref2.windowName,
        _ref2$windowFeatures = _ref2.windowFeatures,
        windowFeatures = _ref2$windowFeatures === void 0 ? 'width=600,height=400,' + 'titlebar=no,resizable=yes,movable=yes,alwaysOnTop=yes,fullscreenable=yes,' + 'location=no,toolbar=no,scrollbars=no,menubar=no,status=no,directories=no,' + 'dialog=yes,modal=yes,dependent=yes' : _ref2$windowFeatures,
        _ref2$storeWindowStat = _ref2.storeWindowState,
        storeWindowState = _ref2$storeWindowStat === void 0 ? true : _ref2$storeWindowStat,
        _ref2$replace = _ref2.replace,
        replace = _ref2$replace === void 0 ? true : _ref2$replace;
    (0, _classCallCheck2.default)(this, WindowControllerFactory);
    this._windowName = windowName;
    this._windowOptions = ['about:blank', windowName, windowFeatures, replace];
    this._storeWindowState = storeWindowState;
  } // region get or create windowController


  (0, _createClass2.default)(WindowControllerFactory, [{
    key: "appendCss",
    value: function appendCss(win) {
      var parentStyleElements = (0, _from.default)(window.document.querySelectorAll('link[rel="stylesheet"][href^="client/"], style'));

      for (var i = 0; i < parentStyleElements.length; i++) {
        var parentStyleElement = parentStyleElements[i];
        var styleElement = void 0;

        switch (parentStyleElement.tagName) {
          case 'LINK':
            styleElement = win.document.createElement('link');
            styleElement.rel = 'stylesheet';
            styleElement.href = parentStyleElement.href;
            break;

          case 'STYLE':
            styleElement = win.document.createElement('style');
            styleElement.id = parentStyleElement.id;
            styleElement.innerHTML = parentStyleElement.innerHTML;
            break;

          default:
            throw new Error('Unexpected style element: ' + styleElement.tagName);
        }

        win.document.head.appendChild(styleElement);
      }
    }
  }, {
    key: "appendContainer",
    value: function appendContainer(win) {
      win.container = win.document.createElement('div');
      win.document.body.appendChild(win.container);
    } // endregion
    // region onLoad

  }, {
    key: "onLoad",
    value: function onLoad(windowController) {
      var _loadSubject = this._loadSubject;

      if (_loadSubject) {
        _loadSubject.emit(windowController);
      }
    } // endregion
    // // region onClose
    //
    // private _closeSubject: ISubject<WindowController>
    //
    // // tslint:disable-next-line:no-identical-functions
    // public get closeObservable(): IObservable<WindowController> {
    // 	let {_closeSubject} = this
    // 	if (!_closeSubject) {
    // 		this._closeSubject = _closeSubject = new Subject()
    // 	}
    // 	return _closeSubject
    // }
    //
    // private onClose(windowController: WindowController) {
    // 	const {_closeSubject} = this
    // 	if (_closeSubject) {
    // 		_closeSubject.emit(windowController)
    // 	}
    // }
    //
    // // endregion

  }, {
    key: "close",
    value: function close() {
      if (this._windowController) {
        this._windowController.close();
      }
    }
  }, {
    key: "windowController",
    get: function get() {
      var _this5 = this;

      if (windowIsDestroyed(window)) {
        return null;
      }

      if (!this._windowController || !this._windowController.isOpened) {
        var _window;

        console.log('Window open');

        var win = (_window = window).open.apply(_window, this._windowOptions);

        if (!win) {
          console.error('Cannot create popup window');
          return null;
        }

        if (getWindowController(win)) {
          var _window2;

          win.close();
          win = (_window2 = window).open.apply(_window2, this._windowOptions);

          if (getWindowController(win)) {
            throw new Error('Cannot recreate window with name: ' + this._windowName);
          }
        }

        var onParentWindowUnload = function onParentWindowUnload() {
          window.removeEventListener('beforeunload', onParentWindowUnload);
          win.close();
        };

        window.addEventListener('beforeunload', onParentWindowUnload);
        this.appendCss(win);
        this.appendContainer(win);
        var windowController = createWindowController({
          windowName: this._windowName,
          win: win,
          storeWindowState: this._storeWindowState
        });
        this._windowController = windowController;
        windowController.loadObservable.subscribe(function () {
          if (!windowController.isOpened) {
            return;
          }

          _this5.onLoad(windowController);
        });
      }

      return this._windowController;
    }
  }, {
    key: "loadObservable",
    // tslint:disable-next-line:no-identical-functions
    get: function get() {
      var _loadSubject = this._loadSubject;

      if (!_loadSubject) {
        this._loadSubject = _loadSubject = new _webrain.Subject();
      }

      return _loadSubject;
    }
  }]);
  return WindowControllerFactory;
}();

exports.WindowControllerFactory = WindowControllerFactory;