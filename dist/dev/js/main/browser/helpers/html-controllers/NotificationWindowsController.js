"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.notificationWindowsController = void 0;

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _webrain = require("webrain");

var _WindowController = require("./WindowController");

var UNSUBSCRIBERS_PROPERTY_NAME = '61e3ecc3f7ff48f2ab75bc7f8c86ed3b';
var unsubscribePropertyIndex = 1;

var NotificationWindowsController =
/*#__PURE__*/
function (_ObservableClass) {
  (0, _inherits2.default)(NotificationWindowsController, _ObservableClass);

  function NotificationWindowsController() {
    var _getPrototypeOf2, _context;

    var _this;

    (0, _classCallCheck2.default)(this, NotificationWindowsController);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(NotificationWindowsController)).call.apply(_getPrototypeOf2, (0, _concat.default)(_context = [this]).call(_context, args)));
    _this._windowControllers = [];
    _this._unsubscribePropertyName = UNSUBSCRIBERS_PROPERTY_NAME + unsubscribePropertyIndex++;
    _this.margin = 16;
    return _this;
  }

  (0, _createClass2.default)(NotificationWindowsController, [{
    key: "show",
    value: function show(win) {
      var _context2,
          _this2 = this;

      var controller = (0, _WindowController.getWindowController)(win);
      var index = (0, _indexOf.default)(_context2 = this._windowControllers).call(_context2, controller);

      if (index >= 0) {
        return;
      }

      var unsubscribers = controller[this._unsubscribePropertyName] = [];
      unsubscribers.push(controller.loadObservable.subscribe(function (o) {
        _this2.onLoad(win);
      }));
      unsubscribers.push(controller.resizeObservable.subscribe(function (o) {
        _this2.onResize(win);
      }));
      unsubscribers.push(controller.closeObservable.subscribe(function (o) {
        _this2.onClose(win);
      }));

      this._windowControllers.push(controller);

      this.updatePositions();
    }
  }, {
    key: "updatePositions",
    value: function updatePositions() {
      var width = screen.availWidth;
      var height = screen.availHeight;

      for (var i = 0; i < this._windowControllers.length; i++) {
        var controller = this._windowControllers[i];

        if (controller.isOpened && controller.isLoaded) {
          controller.win.moveTo(width - controller.sizeController.width - this.margin || 0, height - controller.sizeController.height - this.margin || 0);
        }
      }
    }
  }, {
    key: "onClose",
    value: function onClose(win) {
      var _context3, _context4;

      var controller = (0, _WindowController.getWindowController)(win);
      var unsubscribers = controller[this._unsubscribePropertyName];
      delete controller[this._unsubscribePropertyName];

      if (unsubscribers) {
        for (var i = 0, len = unsubscribers.length; i < len; i++) {
          unsubscribers[i]();
        }
      }

      var index = (0, _indexOf.default)(_context3 = this._windowControllers).call(_context3, controller);
      (0, _splice.default)(_context4 = this._windowControllers).call(_context4, index, 1);
      this.updatePositions();
    }
  }, {
    key: "onLoad",
    value: function onLoad(win) {
      this.updatePositions();
    }
  }, {
    key: "onResize",
    value: function onResize(win) {
      this.updatePositions();
    }
  }]);
  return NotificationWindowsController;
}(_webrain.ObservableClass);

var notificationWindowsController = new NotificationWindowsController();
exports.notificationWindowsController = notificationWindowsController;