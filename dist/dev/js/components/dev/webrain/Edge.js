"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.Edge = exports.EdgeType = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _webrain = require("webrain");

var _common = require("./common");

var _edgeStyles;

var EdgeType;
exports.EdgeType = EdgeType;

(function (EdgeType) {
  EdgeType["ObjectPart"] = "ObjectPart";
  EdgeType["Connect"] = "Connect";
  EdgeType["Dependency"] = "Dependency";
  EdgeType["DeepSubscribe"] = "DeepSubscribe";
})(EdgeType || (exports.EdgeType = EdgeType = {}));

var edgeStyles = (_edgeStyles = {
  common: function common(_ref) {
    var opacity = _ref.opacity;
    return {
      dashes: false,
      ifNull: {// dashes: true,
      },
      font: {
        color: (0, _common.colorOpacity)('#000000', opacity)
      }
    };
  }
}, _edgeStyles[EdgeType.ObjectPart] = function (_ref2) {
  var opacity = _ref2.opacity;
  return {
    color: (0, _common.colorOpacity)('#000000', opacity)
  };
}, _edgeStyles[EdgeType.Connect] = function (_ref3) {
  var opacity = _ref3.opacity;
  return {
    color: (0, _common.colorOpacity)('#0000ff', opacity)
  };
}, _edgeStyles[EdgeType.Dependency] = function (_ref4) {
  var opacity = _ref4.opacity;
  return {
    color: (0, _common.colorOpacity)('#df0000', opacity)
  };
}, _edgeStyles[EdgeType.DeepSubscribe] = function (_ref5) {
  var opacity = _ref5.opacity;
  return {
    dashes: true,
    color: (0, _common.colorOpacity)('#000000', opacity)
  };
}, _edgeStyles);

var Edge =
/*#__PURE__*/
function (_ObservableClass) {
  (0, _inherits2.default)(Edge, _ObservableClass);

  function Edge(_ref6) {
    var _this;

    var id = _ref6.id,
        type = _ref6.type,
        fromId = _ref6.fromId,
        toId = _ref6.toId,
        key = _ref6.key,
        keyType = _ref6.keyType;
    (0, _classCallCheck2.default)(this, Edge);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Edge).call(this));
    _this.valueHistory = [];
    _this.id = id;
    _this.type = type;
    _this.fromId = fromId;
    _this.toId = toId;
    _this.key = key;
    _this.keyType = keyType;
    return _this;
  }

  (0, _createClass2.default)(Edge, [{
    key: "getVisData",
    value: function getVisData(_ref7) {
      var opacity = _ref7.opacity,
          age = _ref7.age;
      var value = this._visData;

      if (!value) {
        this._visData = value = new _common.WebrainObject();
        value.name = 'Edge.WebrainObject' + _common.WebrainGraphObjectsId, value.id = this.id;
        value.from = this.fromId;
        value.to = this.toId;
        value.arrows = {
          to: {
            enabled: true
          }
        };
      }

      var keyStr = this.key;
      var valueStr = this.value && (0, _common.getDisplayName)(this.value);
      var label = this.key || ''; // if (valueStr) {

      label += ' = ' + valueStr; // }

      value.label = label;

      if (this.type != null) {
        var common = edgeStyles.common({
          opacity: opacity
        });
        var specific = edgeStyles[this.type]({
          opacity: opacity
        });
        var style = (0, _common.deepMerge)({
          fill: true
        }, {}, common, specific, this.value == null ? common.ifNull : void 0, this.value == null ? specific.ifNull : void 0);

        for (var key in style) {
          if (Object.prototype.hasOwnProperty.call(style, key)) {
            value[key] = (0, _common.deepMerge)({
              fill: false
            }, value[key], style[key]);
          }
        }
      }

      return value;
    }
  }]);
  return Edge;
}(_webrain.ObservableClass);

exports.Edge = Edge;
new _webrain.CalcObjectBuilder(Edge.prototype).writable('count').writable('value', {
  setOptions: {
    equalsFunc: function equalsFunc() {
      return false;
    },
    afterChange: function afterChange(oldValue, newValue) {
      this.valueHistory.push(newValue);

      if (this.valueHistory.length > _common.VALUE_HISTORY_MAX_SIZE) {
        delete this.valueHistory[this.valueHistory.length - _common.VALUE_HISTORY_MAX_SIZE - 1];
      }
    }
  }
}).calc('updateId', function (o) {
  return o;
}, // connect to self
(0, _webrain.calcPropertyFactory)({
  name: 'Edge.updateId' + _common.WebrainGraphObjectsId,
  dependencies: function dependencies(d) {
    return d.invalidateOn(function (b) {
      return b.noAutoRules().propertyPredicate(function (p) {
        return p !== 'visData' && p !== 'updateId';
      }, '!visData && !updateId');
    });
  },
  calcFunc: function calcFunc(state) {
    state.value = _common.updateId[0]++;
  }
}));