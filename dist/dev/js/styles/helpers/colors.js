"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _color = _interopRequireDefault(require("color"));

// @ts-ignore
function palette(baseColor, minLight) {
  if (minLight === void 0) {
    minLight = 5;
  }

  var hsl = (0, _color.default)(baseColor).hsl().color;
  var h = hsl[0];
  var s = hsl[1];
  var coef = Math.pow(minLight / 100, 1 / 15);
  var result = [];
  result[0] = '#000';
  result[16] = '#fff';
  var light = 100;

  for (var i = 0; i < 15; i++) {
    result[15 - i] = _color.default.hsl(h, s, light *= coef).toString();
  }

  return result;
}

module.exports = {
  palette: palette
};