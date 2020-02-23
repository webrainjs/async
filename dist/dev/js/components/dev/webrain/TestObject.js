"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.TestObject = void 0;

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _webrain = require("webrain");

var TestObject =
/*#__PURE__*/
function (_ObservableClass) {
  (0, _inherits2.default)(TestObject, _ObservableClass);

  function TestObject() {
    var _getPrototypeOf2, _context;

    var _this;

    (0, _classCallCheck2.default)(this, TestObject);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(TestObject)).call.apply(_getPrototypeOf2, (0, _concat.default)(_context = [this]).call(_context, args)));
    _this.value1 = 1;
    _this.value2 = 2;
    return _this;
  }

  return TestObject;
}(_webrain.ObservableClass);

exports.TestObject = TestObject;
new _webrain.CalcObjectBuilder(TestObject.prototype).writable('value1').writable('value2').calc('sum', (0, _webrain.connectorFactory)({
  buildRule: function buildRule(c) {
    return c.connect('val1', function (b) {
      return b.p('value1');
    }).connect('val2', function (b) {
      return b.p('value2');
    });
  }
}), (0, _webrain.calcPropertyFactory)({
  dependencies: function dependencies(d) {
    return d.invalidateOn(function (b) {
      return b.propertyAny();
    });
  },
  calcFunc: function calcFunc(state) {
    state.value = state.input.val1 + state.input.val2;
  }
})).calc('time', null, (0, _webrain.calcPropertyFactory)({
  dependencies: function dependencies(d) {
    return d.invalidateOn(function (b) {
      return b.propertyAny();
    });
  },
  calcFunc: function calcFunc(state) {
    state.value = new Date();
  },
  calcOptions: {
    autoInvalidateInterval: 1000
  }
}));