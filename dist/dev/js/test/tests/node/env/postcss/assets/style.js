"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var css = requireCss('./style.css');
var obj = {
  test1: 'test 1'
};

var _default = (0, _extends2.default)({
  css: css,
  test1: obj === null || obj === void 0 ? void 0 : obj.test1
}, {
  test2: 'test 2'
});

exports.default = _default;