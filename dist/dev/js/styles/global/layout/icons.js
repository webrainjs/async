"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _templates = _interopRequireDefault(require("../../helpers/templates"));

module.exports = [{
  '.icon': {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    margin: "auto"
  },
  '.icon-block': {
    display: "block",
    width: "1em",
    height: "1em"
  },
  '.icon-inline': (0, _extends2.default)({
    display: "inline-block",
    width: "1em",
    height: "1em",
    'vertical-align': "middle",
    'margin-top': "-0.223em",
    'white-space': "nowrap"
  }, _templates.default.fonts.clear)
}];