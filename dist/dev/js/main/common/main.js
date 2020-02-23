"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.main = main;
exports.default = void 0;

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _helpers = _interopRequireDefault(require("./helpers/helpers"));

function main(args) {
  console.log((0, _stringify.default)(args), _helpers.default.test);
}

var _default = {
  main: main
};
exports.default = _default;