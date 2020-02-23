"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _templates = _interopRequireDefault(require("../../helpers/templates"));

var _context, _ref;

module.exports = [_templates.default.buttonsReset, _templates.default.textboxReset, (_ref = {
  '*:focus': {
    outline: "none"
  },
  a: (0, _extends2.default)({}, _templates.default.anchorColor({
    all: "inherit"
  }), {
    'text-decoration': "inherit"
  }, _templates.default.noSelect, {}, _templates.default.noDrag),
  button: {
    'white-space': "nowrap"
  }
}, _ref[(0, _map.default)(_context = ['radio', 'checkbox']).call(_context, function (o) {
  return "input[type='" + o + "']";
}).join(', ')] = (0, _extends2.default)({}, _templates.default.inputHidden), _ref.td = {
  padding: "0"
}, _ref.table = {
  'border-spacing': "0"
}, _ref.main = {
  // font rendering
  // 'text-shadow'   : `1px 1px 1px rgba(0,0,0,0.004)`,
  'text-rendering': "optimizeSpeed",
  '-webkit-font-smoothing': "none",
  'user-select': "none"
}, _ref)];