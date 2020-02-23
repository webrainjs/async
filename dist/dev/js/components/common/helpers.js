"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.timeToString = timeToString;
exports.dateTimeToString = dateTimeToString;
exports.timeOfDayToString = timeOfDayToString;
exports.dateToString = dateToString;
exports.getElapsedTime = getElapsedTime;
exports.runInContext = runInContext;
exports.toValuesIterable = toValuesIterable;
exports.toValuesArray = toValuesArray;

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

var _padStart = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/pad-start"));

function timeToString(time) {
  var _context, _context2;

  if (time == null) {
    return '--:--:--';
  }

  var negative;

  if (time < 0) {
    negative = true;
    time = -time;
  }

  time = time / 1000 | 0;
  var sec = time % 60;
  time = time / 60 | 0;
  var min = time % 60;
  time = time / 60 | 0;
  var hour = time;
  return (negative ? '-' : '') + (hour + ":" + (0, _padStart.default)(_context = min.toString()).call(_context, 2, '0') + ":" + (0, _padStart.default)(_context2 = sec.toString()).call(_context2, 2, '0'));
}

function dateTimeToString(date) {
  var _context3, _context4, _context5, _context6, _context7;

  if (!date) {
    return '--/--/---- --:--:-- --';
  }

  return [(0, _padStart.default)(_context3 = date.getMonth() + 1 + '').call(_context3, 2, '0'), '/', (0, _padStart.default)(_context4 = date.getDay() + '').call(_context4, 2, '0'), '/', date.getFullYear(), ' ', (0, _padStart.default)(_context5 = (date.getHours() + 11) % 12 + 1 + '').call(_context5, 2, '0'), ':', (0, _padStart.default)(_context6 = date.getMinutes() + '').call(_context6, 2, '0'), ':', (0, _padStart.default)(_context7 = date.getSeconds() + '').call(_context7, 2, '0'), ' ', date.getHours() > 12 ? 'PM' : 'AM'].join('');
}

function timeOfDayToString(date) {
  var _context8, _context9, _context10;

  if (!date) {
    return '--:--:-- --';
  }

  return [(0, _padStart.default)(_context8 = (date.getHours() + 11) % 12 + 1 + '').call(_context8, 2, '0'), ':', (0, _padStart.default)(_context9 = date.getMinutes() + '').call(_context9, 2, '0'), ':', (0, _padStart.default)(_context10 = date.getSeconds() + '').call(_context10, 2, '0'), ' ', date.getHours() > 12 ? 'PM' : 'AM'].join('');
}

function dateToString(date) {
  var _context11, _context12;

  if (!date) {
    return '--/--/----';
  }

  return [(0, _padStart.default)(_context11 = date.getMonth() + 1 + '').call(_context11, 2, '0'), '/', (0, _padStart.default)(_context12 = date.getDay() + '').call(_context12, 2, '0'), '/', date.getFullYear(), ' '].join('');
}

function getElapsedTime(date, now) {
  if (!date) {
    return null;
  }

  return (now || (0, _now.default)()) - date.getTime();
} // Experimental, not worked yet


var contextPropName = 'afd7447c140f4e38bd2fb6e853784f5f';

function runInContext(win, func) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  win[contextPropName] = {
    func: func,
    args: args
  };
  var result = win.eval("(function() {\n\t\ttry {\n\t\t\treturn { result: window['" + contextPropName + "'].func.apply(null, window['" + contextPropName + "'].args)\n\t\t}\n\t\t} catch (error) {\n\t\t\treturn { error }\n\t\t}\n\t})()");

  if (result.error) {
    throw result.error;
  }

  return result.result;
}

function toValuesIterable(object, defaultValues) {
  if (defaultValues === void 0) {
    defaultValues = [];
  }

  if (object && typeof object === 'object' && typeof (0, _values.default)(object) === 'function') {
    return (0, _values.default)(object).call(object) || defaultValues;
  }

  return object || defaultValues;
}

function toValuesArray(object, defaultValues) {
  if (defaultValues === void 0) {
    defaultValues = [];
  }

  return (0, _from.default)(toValuesIterable(object, defaultValues));
}