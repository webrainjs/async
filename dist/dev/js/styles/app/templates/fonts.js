"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _templates = _interopRequireDefault(require("../../helpers/templates"));

/* tslint:disable:quotemark no-duplicate-string */
var sourceSansPro = _templates.default.fontFamily({
  family: 'Source Sans Pro',
  size: 1.035,
  lineHeightNormalize: 0.942
});

var _default = {
  sourceSansPro: sourceSansPro
};
exports.default = _default;