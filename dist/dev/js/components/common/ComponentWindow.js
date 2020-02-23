"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ComponentWindow = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var ComponentWindow =
/*#__PURE__*/
function () {
  // resizable=no is not worked in browsers because: https://stackoverflow.com/a/15481333/5221762
  function ComponentWindow(_ref) {
    var _this = this;

    var windowControllerFactory = _ref.windowControllerFactory,
        componentClass = _ref.componentClass,
        options = _ref.options,
        props = _ref.props;
    (0, _classCallCheck2.default)(this, ComponentWindow);
    this._windowControllerFactory = windowControllerFactory;
    this._componentClass = componentClass;
    this._options = options;
    this._props = props;

    this._windowControllerFactory.loadObservable.subscribe(
    /*#__PURE__*/
    function () {
      var _ref2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(windowController) {
        var destroy;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.attachComponent({
                  windowController: windowController,
                  componentClass: _this._componentClass,
                  options: (0, _extends2.default)({}, _this._options, {
                    props: _this._props
                  })
                });

              case 2:
                destroy = _context.sent;

                if (destroy) {
                  windowController.closeObservable.subscribe(destroy);
                }

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }

  (0, _createClass2.default)(ComponentWindow, [{
    key: "attachComponent",
    // async needed for bypass slows down performance on electron
    value: function () {
      var _attachComponent = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(_ref3) {
        var _this2 = this;

        var windowController, componentClass, options, component;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                windowController = _ref3.windowController, componentClass = _ref3.componentClass, options = _ref3.options;
                component = new componentClass((0, _extends2.default)({}, options, {
                  target: windowController.win.container,
                  props: (0, _extends2.default)({
                    win: windowController.win
                  }, options && options.props)
                }));
                this._component = component;
                return _context2.abrupt("return", function () {
                  if (_this2._component === component) {
                    _this2._component = null;
                  }

                  if (windowController.isDestroyed) {
                    return;
                  }

                  component.$destroy();
                });

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function attachComponent(_x2) {
        return _attachComponent.apply(this, arguments);
      }

      return attachComponent;
    }()
  }, {
    key: "setProps",
    value: function setProps(props) {
      this._props = props;

      if (this._component) {
        this._component.$set(this._props);
      }
    }
  }, {
    key: "close",
    value: function close() {
      this._windowControllerFactory.close();
    }
  }, {
    key: "windowController",
    get: function get() {
      return this._windowControllerFactory.windowController;
    }
  }]);
  return ComponentWindow;
}();

exports.ComponentWindow = ComponentWindow;