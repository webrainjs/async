"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _templates = _interopRequireWildcard(require("../../../helpers/templates"));

var _colors = _interopRequireDefault(require("../../templates/colors"));

module.exports = [{
  '.icon': [{
    '&-window': {
      '&-minimize': (0, _templates.iconMask)({
        url: 'client/images/icons/window/minimize.png',
        y: "83%"
      }),
      '&-maximize': (0, _templates.iconMask)({
        url: 'client/images/icons/window/maximize.png',
        y: "80%"
      }),
      '&-restore': (0, _templates.iconMask)({
        url: 'client/images/icons/window/restore.png'
      }),
      '&-close': (0, _templates.iconMask)({
        url: 'client/images/icons/window/close.png'
      }),
      '&-fullscreen': {
        '&-enter': (0, _templates.iconMask)({
          url: 'client/images/icons/window/fullscreen-enter.png'
        }),
        '&-exit': (0, _templates.iconMask)({
          url: 'client/images/icons/window/fullscreen-exit.png'
        })
      }
    },
    '&-check': (0, _templates.iconMask)({
      url: 'client/images/icons/check.png'
    }),
    '&-loading': (0, _templates.icon)({
      url: 'client/images/icons/loading.png',
      // see also: base/at-rules.js and https://stackoverflow.com/a/16771693/5221762
      animation: "spin 4s linear infinite"
    })
  }, _templates.default.important({
    '&--blue': {
      'background-color': _colors.default.blue
    },
    '&--gray': {
      'background-color': _colors.default.base[14]
    },
    '&--red': {
      'background-color': _colors.default.red[13]
    },
    '&--yellow': {
      'background-color': _colors.default.yellow
    },
    '&--green': {
      'background-color': _colors.default.green
    }
  })]
}];