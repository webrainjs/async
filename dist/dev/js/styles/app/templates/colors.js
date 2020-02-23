"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _templates = _interopRequireDefault(require("../../helpers/templates"));

var base = _templates.default.palette('#000');

var green = '#0EC06E';
var blue = '#4D7EE8';
var yellow = '#CDA837';

var red = _templates.default.palette('#f00');

var border = {
  base: base[8]
};
var _default = {
  base: base,
  green: green,
  blue: blue,
  red: red,
  yellow: yellow,
  border: border
};
exports.default = _default;