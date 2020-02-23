"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.objectToString = objectToString;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isIterable2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/is-iterable"));

var _isArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _isNan = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/is-nan"));

var _webrain = require("webrain");

function filter(obj) {
  if (typeof EventTarget !== 'undefined' && obj instanceof EventTarget) {
    return false;
  }

  return true;
}

function objectToString(object) {
  if (object == null) {
    return object + '';
  }

  var buffer = [];

  var append = function append(obj, tabs, parents) {
    if (typeof obj === 'undefined') {
      buffer.push('undefined');
      return;
    }

    if (obj === null) {
      buffer.push('null');
      return;
    }

    if (typeof obj === 'number' || typeof obj === 'boolean') {
      buffer.push(obj.toString());
      return;
    }

    if (typeof obj === 'string') {
      buffer.push('"');
      buffer.push(obj);
      buffer.push('"');
      return;
    }

    if (obj instanceof Date) {
      buffer.push('<Date> ');
      buffer.push((0, _isNan.default)(obj.getTime()) ? 'NaN' : obj.toISOString());
      return;
    }

    if (obj instanceof Error) {
      obj._stack = obj.stack || obj.toString();
    }

    if (obj.valueOf) {
      var value = obj.valueOf();

      if (value !== obj) {
        if (obj.constructor) {
          buffer.push('<');
          buffer.push(obj.constructor.name);
          var id = (0, _webrain.getObjectUniqueId)(obj);

          if (id) {
            buffer.push('-');
            buffer.push(id.toString());
          }

          buffer.push('> ');
        }

        append(value, tabs, parents);
        return;
      }
    }

    if (typeof obj === 'object') {
      var _context;

      if (parents && (0, _indexOf.default)(parents).call(parents, obj) >= 0) {
        buffer.push('...');
        return;
      }

      parents = parents ? (0, _concat.default)(_context = [obj]).call(_context, parents) : [obj];

      if (!filter(obj)) {
        buffer.push('<');
        buffer.push(obj.constructor.name);
        buffer.push('> {...}');
        return;
      }

      if ((0, _isArray2.default)(obj)) {
        buffer.push('[');
      } else if (obj.constructor) {
        buffer.push('<');
        buffer.push(obj.constructor.name);

        var _id = (0, _webrain.getObjectUniqueId)(obj);

        if (_id) {
          buffer.push('-');
          buffer.push(_id.toString());
        }

        buffer.push('> {');
      } else {
        buffer.push('{');
      }

      var newTabs = tabs + '\t';
      var first = true; // tslint:disable-next-line:forin

      for (var key in obj) {
        if (!first) {
          buffer.push(',\r\n');
        } else {
          buffer.push('\r\n');
          first = false;
        }

        buffer.push(newTabs);
        buffer.push(key);
        buffer.push(': ');
        append(obj[key], newTabs, parents);
      }

      if (!first) {
        buffer.push(',\r\n');
        buffer.push(tabs);
      }

      if ((0, _isArray2.default)(obj)) {
        buffer.push(']');
      } else {
        buffer.push('}');
      }

      if (!(0, _isArray2.default)(obj) && (0, _isIterable2.default)(obj)) {
        buffer.push('[');
        var index = 0;

        for (var _iterator = obj, _isArray = (0, _isArray2.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var item = _ref;

          if (index > 0) {
            buffer.push(',\r\n');
          } else {
            buffer.push('\r\n');
            first = false;
          }

          buffer.push(tabs);
          buffer.push(index.toString());
          buffer.push(': ');
          append(item, newTabs, parents);
        }

        if (index > 0) {
          buffer.push(',\r\n');
          buffer.push(tabs);
        }

        buffer.push(']');
      }

      return;
    }

    buffer.push(obj.toString());
  };

  append(object, '', null);
  return buffer.join('');
}