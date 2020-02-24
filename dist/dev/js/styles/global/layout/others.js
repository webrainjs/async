"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _fill = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/fill"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _templates = _interopRequireDefault(require("../../helpers/templates"));

module.exports = [{
  '.fill': (0, _extends2.default)({}, (0, _fill.default)(_templates.default))
}, _templates.default.important({
  '.stretch': {
    width: '100%',
    height: '100%',
    '&-horizontal': {
      width: '100%'
    },
    '&-vertical': {
      height: '100%'
    }
  },
  '.fit': {
    width: 'fit-content',
    height: 'fit-content',
    '&-horizontal': {
      width: 'fit-content'
    },
    '&-vertical': {
      height: 'fit-content'
    },
    '&-min': {
      width: 'min-content',
      height: 'min-content',
      '&-horizontal': {
        width: 'min-content'
      },
      '&-vertical': {
        height: 'min-content'
      }
    },
    '&-max': {
      width: 'max-content',
      height: 'max-content',
      '&-horizontal': {
        width: 'max-content'
      },
      '&-vertical': {
        height: 'max-content'
      }
    }
  },
  '.center': {
    'text-align': 'center',
    'vertical-align': 'middle',
    '&-horizontal': {
      'text-align': 'center'
    },
    '&-vertical': {
      'vertical-align': 'middle'
    }
  },
  '.nowrap': (0, _extends2.default)({}, _templates.default.noWrap(), {
    '&-2': (0, _extends2.default)({}, _templates.default.noWrap({
      maxLines: 2
    })),
    '&-3': (0, _extends2.default)({}, _templates.default.noWrap({
      maxLines: 3
    }))
  }),
  '.wrap': {
    'white-space': "normal"
  },
  '.overflow': {
    '&-hidden': {
      overflow: "hidden"
    },
    '&-visible': {
      overflow: "visible"
    }
  },
  '.position': {
    '&-relative': {
      position: "relative"
    }
  },
  '.float': {
    '&-left': {
      'float': "left"
    },
    '&-right': {
      'float': "right"
    },
    '&-clear': {
      '&-left': {
        clear: "left"
      },
      '&-right': {
        clear: "right"
      },
      '&-both': {
        clear: "both"
      }
    }
  }
})];