"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _colors = _interopRequireDefault(require("../../templates/colors"));

var _fonts = _interopRequireDefault(require("../../templates/fonts"));

var _constants = _interopRequireDefault(require("../../../helpers/constants"));

module.exports = [{
  // default font
  '.text': _fonts.default.sourceSansPro['.text'],
  '.font': _fonts.default.sourceSansPro['.font']
}, {
  '.font': {
    '&-base': {
      'font-family': _constants.default.fonts.base,
      'font-size': _constants.default.fontSizeBase,
      color: _colors.default.base[16],
      'letter-spacing': "normal",
      'line-height': "normal",
      'font-weight': "normal",
      '-webkit-font-smoothing': "antialiased",
      '-moz-osx-font-smoothing': "grayscale",
      'text-rendering': "geometricPrecision",
      'text-transform': "none"
    },
    '&-primary': {
      'font-size': "140%",
      '&-bold': {
        'font-size': "140%",
        'letter-spacing': "0.0113em",
        'font-weight': "600"
      }
    }
  }
}];