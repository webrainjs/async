"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.MainWindow = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _webrain = require("webrain");

var _WindowController = require("../../main/browser/helpers/html-controllers/WindowController");

/* tslint:disable:no-conditional-assignment */
var MainWindow =
/*#__PURE__*/
function (_ObservableClass) {
  (0, _inherits2.default)(MainWindow, _ObservableClass);

  function MainWindow() {
    (0, _classCallCheck2.default)(this, MainWindow);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(MainWindow).apply(this, arguments));
  }

  (0, _createClass2.default)(MainWindow, [{
    key: "show",
    // public readonly brain: IBrain
    //
    // constructor(brain: IBrain) {
    // 	super()
    // 	this.brain = brain
    // }
    // region methods
    value: function show() {
      var windowController = (0, _webrain.resolvePath)(this)(function (o) {
        return o.windowController;
      })();

      if (windowController) {
        windowController.show();
      }
    }
  }, {
    key: "minimize",
    value: function minimize() {
      var windowController = (0, _webrain.resolvePath)(this)(function (o) {
        return o.windowController;
      })();

      if (windowController) {
        windowController.minimize();
      }
    } // endregion
    // region writable
    // endregion

  }]);
  return MainWindow;
}(_webrain.ObservableClass);

exports.MainWindow = MainWindow;
new _webrain.CalcObjectBuilder(MainWindow.prototype).writable('win').calc('windowController', (0, _webrain.connectorFactory)({
  buildRule: function buildRule(c) {
    return c.connect('win', function (b) {
      return b.p('win');
    });
  }
}), (0, _webrain.calcPropertyFactory)({
  dependencies: function dependencies(d) {
    return d.invalidateOn(function (b) {
      return b.propertyAny();
    });
  },
  calcFunc: function calcFunc(state) {
    state.value = (0, _WindowController.getWindowController)(state.input.win);
  }
})).calcConnect('isVisible', function (b) {
  return b.p('windowController').p('isVisible');
}).calcConnect('isFocused', function (b) {
  return b.p('windowController').p('isFocused');
}); // .calc('lostFocusDate',
// 	connectorFactory({
// 		buildRule: c => c
// 			.connect('isFocused', b => b.p('isFocused')),
// 	}),
// 	calcPropertyFactory({
// 		dependencies: d => d.invalidateOn(b => b.propertyAny()),
// 		calcFunc(state) {
// 			if (state.input.isFocused) {
// 				state.value = null
// 			} else {
// 				if (!state.value) {
// 					state.value = new Date()
// 				}
// 			}
// 		},
// 	}),
// )