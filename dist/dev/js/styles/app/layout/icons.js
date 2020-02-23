"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _constants = _interopRequireDefault(require("../../helpers/constants"));

var fontClear = {
  'font-size': "100%",
  'font-family': _constants.default.fonts.base,
  color: "rgba(0,0,0,0)",
  'text-transform': "none",
  'text-rendering': "initial",
  'text-size-adjust': "initial",
  'letter-spacing': "initial",
  'font-weight': "initial",
  '-webkit-box-direction': "initial",
  '-webkit-font-smoothing': "initial"
};
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
  }, fontClear)
}];