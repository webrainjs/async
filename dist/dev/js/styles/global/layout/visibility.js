"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _templates = _interopRequireDefault(require("../../helpers/templates"));

module.exports = [_templates.default.important({
  '.hidden': {
    visibility: "hidden"
  },
  '.collapsed': {
    display: "none"
  },
  '.no-ghost-childs > *': {
    'pointer-events': "auto",
    'user-select': "auto"
  },
  '.ghost': {
    'pointer-events': "none",
    'user-select': "none"
  },
  '.no-ghost': {
    'pointer-events': "auto",
    'user-select': "auto"
  }
})];