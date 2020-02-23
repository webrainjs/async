"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _constants = _interopRequireDefault(require("../helpers/constants.js"));

var _ref;

module.exports = [(_ref = {
  body: {
    'font-size': _constants.default.fontSizeBase,
    'font-family': _constants.default.fonts.regular
  },
  td: {
    'vertical-align': "middle",
    'padding-left': "0",
    'padding-right': "0",
    'padding-top': "0",
    'padding-bottom': "0"
  },
  th: {
    'text-align': "left"
  },
  button: {
    position: "relative",
    'font-size': "inherit"
  }
}, _ref[_constants.default.selectors.all] = {
  'background-repeat': "no-repeat",
  'background-position': "center",
  'background-size': "contain",
  'mask-repeat': "no-repeat",
  'mask-position': "center",
  'mask-size': "contain",
  'box-sizing': "border-box"
}, _ref)];