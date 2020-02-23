"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _fill = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/fill"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _templates = _interopRequireDefault(require("../../helpers/templates"));

module.exports = [{
  '.scroll': {
    position: "relative",
    overflow: "auto",
    '& > .scroll__content': (0, _extends2.default)({}, (0, _fill.default)(_templates.default), {
      right: "auto",
      bottom: "auto"
    }),
    '&-vertical': {
      position: "relative",
      'overflow-y': "auto",
      'overflow-x': "hidden",
      '& > .scroll__content': (0, _extends2.default)({}, (0, _fill.default)(_templates.default), {
        bottom: "auto"
      }),
      '&--force': {
        'overflow-y': "scroll"
      }
    },
    '&-horizontal': {
      position: "relative",
      'overflow-y': "hidden",
      'overflow-x': "auto",
      '& > .scroll__content': (0, _extends2.default)({}, (0, _fill.default)(_templates.default), {
        right: "auto"
      }),
      '&--force': {
        'overflow-x': "scroll"
      }
    },
    '&--force': {
      overflow: "scroll"
    }
  },
  '.scrollbar': _templates.default.important({
    '&--collapsed': {
      'scrollbar-width': "none",
      // Firefox
      '-ms-overflow-style': "none",
      // IE 10+
      '&::-webkit-scrollbar': {
        // Safari and Chrome
        display: "none",
        width: "0",
        height: "0"
      },
      '&::-webkit-scrollbar-corner': {
        display: "none"
      }
    }
  })
}];