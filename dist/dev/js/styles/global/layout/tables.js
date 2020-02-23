"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _fill = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/fill"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _templates = _interopRequireDefault(require("../../helpers/templates"));

module.exports = [{
  '.table-layout': {
    'border-collapse': "collapse",
    'border-spacing': "0",
    position: "relative",
    '&--fill': {
      width: "100%",
      height: "100%",
      '&-horizontal': {
        width: "100%"
      }
    },
    '&--fixed': {
      'table-layout': "fixed"
    },
    '&__row': {
      '&--fill': {
        height: "100%"
      }
    },
    '&__cell': {
      position: "relative",
      overflow: "hidden",
      'vertical-align': "middle",
      '&--fill': {
        width: "100%"
      }
    },
    '&__scroll': (0, _extends2.default)({}, (0, _fill.default)(_templates.default), {
      overflow: "scroll",
      '&-vertical': (0, _extends2.default)({}, (0, _fill.default)(_templates.default), {
        'overflow-y': "scroll",
        'overflow-x': "hidden",
        '.table-layout__content': (0, _extends2.default)({}, (0, _fill.default)(_templates.default), {
          bottom: "auto"
        })
      }),
      '&-horizontal': (0, _extends2.default)({}, (0, _fill.default)(_templates.default), {
        'overflow-y': "hidden",
        'overflow-x': "scroll",
        '.table-layout__content': (0, _extends2.default)({}, (0, _fill.default)(_templates.default), {
          right: "auto"
        })
      })
    })
  }
}];