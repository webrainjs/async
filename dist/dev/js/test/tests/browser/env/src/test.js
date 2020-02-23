"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.test = void 0;

var _flatMap = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/flat-map"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _Array$from, _Array$from$flatMap, _Object$assign, _Object$assign$x;

/* eslint-disable no-shadow */
var x = {};
var test = (_Array$from = (0, _from.default)((_Object$assign = (0, _assign.default)(x, {
  x: {
    y: [['test']]
  }
})) === null || _Object$assign === void 0 ? void 0 : (_Object$assign$x = _Object$assign.x) === null || _Object$assign$x === void 0 ? void 0 : _Object$assign$x.y)) === null || _Array$from === void 0 ? void 0 : (_Array$from$flatMap = (0, _flatMap.default)(_Array$from).call(_Array$from, function (o) {
  return o;
})) === null || _Array$from$flatMap === void 0 ? void 0 : _Array$from$flatMap[0];
exports.test = test;