"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getDisplayName = getDisplayName;
exports.deepMerge = deepMerge;
exports.colorOpacity = colorOpacity;
exports.WebrainObject = exports.WebrainMap = exports.WebrainObservableMap = exports.updateId = exports.VALUE_HISTORY_MAX_SIZE = exports.NoValue = exports.WebrainGraphObjectsId = void 0;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/wrapNativeSuper"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _fill = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/fill"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isNan = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/is-nan"));

var _color = _interopRequireDefault(require("color"));

var _webrain = require("webrain");

/* tslint:disable:no-construct use-primitive-type */
// @ts-ignore
var WebrainGraphObjectsId = '-4ff4f3a6-b8a8-4085-bd85-bb255c9f24a7';
exports.WebrainGraphObjectsId = WebrainGraphObjectsId;
// noinspection JSPrimitiveTypeWrapperUsage
var NoValue = new String('NoValue');
exports.NoValue = NoValue;
var VALUE_HISTORY_MAX_SIZE = 10;
exports.VALUE_HISTORY_MAX_SIZE = VALUE_HISTORY_MAX_SIZE;

function getDisplayName(value) {
  if (typeof value === 'undefined') {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'string') {
    return "\"" + value + "\"";
  }

  if (value instanceof Date) {
    return (0, _isNan.default)(value.getTime()) ? 'NaN' : value.toISOString().replace('T', ' ');
  }

  if (value instanceof _webrain.CalcStat) {
    return value.toString();
  }

  if ((0, _webrain.isIterable)(value)) {
    var iterator = (0, _getIterator2.default)(value);
    var iteration = iterator.next();
    var size = value.length;

    if (size == null) {
      size = value.size;
    }

    var item;

    if (!iteration.done) {
      item = iteration.value;

      if (value[_toStringTag.default] === 'Map') {
        item = item[1];
      }
    }

    return iteration.done ? value.constructor.name + "-" + (0, _webrain.getObjectUniqueId)(value) + "[" + (size || 0) + "]" : value.constructor.name + "-" + (0, _webrain.getObjectUniqueId)(value) + "<" + getDisplayName(item) + ">[" + size + "]";
  }

  if (typeof value === 'object') {
    var name = value instanceof _webrain.CalcProperty && value.state.name || value instanceof _webrain.Connector && value.connectorState.name;

    if (value instanceof _webrain.Connector) {
      return 'Connector.' + (name || '');
    }

    return (name || value.constructor.name) + "-" + (0, _webrain.getObjectUniqueId)(value);
  }

  if (typeof value === 'function') {
    return value.name ? value.name + "()-" + (0, _webrain.getObjectUniqueId)(value) : "() => {...} - " + (0, _webrain.getObjectUniqueId)(value);
  }

  return value.toString();
}

var emptyObject = {};

function deepMerge(options, base) {
  for (var i = 0, len = arguments.length <= 2 ? 0 : arguments.length - 2; i < len; i++) {
    base = _deepMerge(options, base, i + 2 < 2 || arguments.length <= i + 2 ? undefined : arguments[i + 2]);
  }

  return base;
}

function _deepMerge(options, base, other) {
  if (!(other instanceof Object)) {
    if ((0, _fill.default)(options) && typeof other === 'undefined') {
      return base;
    } else {
      return other;
    }
  }

  if (!(base instanceof Object)) {
    base = {};
  }

  for (var _key in base) {
    if (Object.prototype.hasOwnProperty.call(base, _key)) {
      var v1 = base[_key];
      var v2 = Object.prototype.hasOwnProperty.call(other, _key) ? other[_key] : void 0;
      base[_key] = _deepMerge(options, v1, v2);
    }
  }

  for (var _key2 in other) {
    if (Object.prototype.hasOwnProperty.call(other, _key2)) {
      var _v = Object.prototype.hasOwnProperty.call(base, _key2) ? base[_key2] : void 0;

      var _v2 = other[_key2];
      base[_key2] = _deepMerge(options, _v, _v2);
    }
  }

  return base;
}

function colorOpacity(color, opacity) {
  return (0, _color.default)(color).mix((0, _color.default)('white'), 1.0 - opacity).string();
}

var updateId = [0];
exports.updateId = updateId;

var WebrainObservableMap =
/*#__PURE__*/
function (_ObservableMap) {
  (0, _inherits2.default)(WebrainObservableMap, _ObservableMap);

  function WebrainObservableMap() {
    (0, _classCallCheck2.default)(this, WebrainObservableMap);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(WebrainObservableMap).apply(this, arguments));
  }

  return WebrainObservableMap;
}(_webrain.ObservableMap);

exports.WebrainObservableMap = WebrainObservableMap;

var WebrainMap =
/*#__PURE__*/
function (_Map) {
  (0, _inherits2.default)(WebrainMap, _Map);

  function WebrainMap() {
    (0, _classCallCheck2.default)(this, WebrainMap);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(WebrainMap).apply(this, arguments));
  }

  return WebrainMap;
}((0, _wrapNativeSuper2.default)(_map.default));

exports.WebrainMap = WebrainMap;

var WebrainObject = function WebrainObject() {
  (0, _classCallCheck2.default)(this, WebrainObject);
};

exports.WebrainObject = WebrainObject;