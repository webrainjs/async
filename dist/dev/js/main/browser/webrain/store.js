"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.asReadable = asReadable;
exports.asWriteable = asWriteable;

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _webrain = require("webrain");

// @ts-ignore
var ReadableStore =
/*#__PURE__*/
function () {
  function ReadableStore(object, propertyName) {
    (0, _classCallCheck2.default)(this, ReadableStore);
    this._object = object;
    this._propertyName = propertyName;
  }

  (0, _createClass2.default)(ReadableStore, [{
    key: "subscribe",
    value: function subscribe(run, invalidate) {
      var _this = this;

      return this._object.propertyChanged.subscribe(function (event) {
        if (event.name === _this._propertyName) {
          run(event.newValue);
        }
      });
    }
  }]);
  return ReadableStore;
}();

var WritableStore =
/*#__PURE__*/
function (_ReadableStore) {
  (0, _inherits2.default)(WritableStore, _ReadableStore);

  function WritableStore(object, propertyName) {
    var _this2;

    (0, _classCallCheck2.default)(this, WritableStore);
    _this2 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(WritableStore).call(this, object, propertyName));
    _this2.set = (0, _webrain.createFunction)('o', 'v', "o[\"" + propertyName + "\"] = v");
    return _this2;
  }

  return WritableStore;
}(ReadableStore);

var STORES_PROPERTY_NAME = '192e3271-3e9a-47a7-be1b-b2aaeade9304';

function getStore(object, propertyName, storeFactory) {
  var stores = object[STORES_PROPERTY_NAME];

  if (stores == null) {
    (0, _defineProperty.default)(object, STORES_PROPERTY_NAME, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: stores = {}
    });
  }

  var store = stores[propertyName];

  if (store == null) {
    stores[propertyName] = store = storeFactory(object, propertyName);
  }

  return store;
}

function asReadable(object, propertyName) {
  if (object == null) {
    return object;
  }

  if (typeof object !== 'object' || !('propertyChanged' in object)) {
    return object[propertyName];
  }

  return getStore(object, propertyName, function (o, p) {
    return new ReadableStore(o, p);
  });
}

function asWriteable(object, propertyName) {
  if (object == null) {
    return object;
  }

  if (typeof object !== 'object' || !('propertyChanged' in object)) {
    return object[propertyName];
  }

  return getStore(object, propertyName, function (o, p) {
    return new WritableStore(o, p);
  });
}