"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.Brain = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _webrain = require("webrain");

var _MainWindow = require("./view/MainWindow");

var Brain =
/*#__PURE__*/
function (_ObservableClass) {
  (0, _inherits2.default)(Brain, _ObservableClass);

  function Brain() {
    (0, _classCallCheck2.default)(this, Brain);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Brain).apply(this, arguments));
  }

  (0, _createClass2.default)(Brain, [{
    key: "serialize",
    // region readable
    // endregion
    // region writable
    // endregion
    // region calculable
    // endregion
    // region ISerializable
    value: function serialize(_serialize) {
      return {// auth: serialize(this.auth, { objectKeepUndefined: false }),
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize(_deSerialize, serializedValue) {} // deSerialize(serializedValue.auth, null, {
    // 	valueFactory: () => this.auth,
    // })
    // endregion

  }]);
  return Brain;
}(_webrain.ObservableClass);

exports.Brain = Brain;
Brain.uuid = '17a06236d0804f5eaf55dcad8e9a0628';
(0, _webrain.registerSerializable)(Brain);
new _webrain.CalcObjectBuilder(Brain.prototype).readable('mainWindow', {
  factory: function factory() {
    return new _MainWindow.MainWindow();
  }
});