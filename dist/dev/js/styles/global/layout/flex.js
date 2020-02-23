"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _fill = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/fill"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _templates = _interopRequireDefault(require("../../helpers/templates"));

module.exports = [{
  '.flex': [(0, _extends2.default)({}, _templates.default.layout.flex.base, {
    '&--vertical': (0, _extends2.default)({}, _templates.default.layout.flex.vertical),
    '&--inline': (0, _extends2.default)({}, _templates.default.layout.flex.inline),
    '&__item': [{
      '&--fit': (0, _extends2.default)({}, _templates.default.layout.flex.item.fit),
      '&--fill': (0, _extends2.default)({}, (0, _fill.default)(_templates.default.layout.flex.item))
    }, _templates.default.important({
      '&--align': {
        '&-start': {
          'place-self': "flex-start"
        },
        '&-center': {
          'align-self': "center"
        },
        '&-stretch': {
          'align-self': "stretch"
        },
        '&-end': {
          'align-self': "flex-end"
        }
      }
    })]
  }), _templates.default.important({
    '&--center': {
      'align-items': "center",
      '-webkit-box-align': "inherit",
      'justify-content': "center"
    },
    '&--align': {
      '&-start': {
        'align-items': "flex-start"
      },
      '&-center': {
        'align-items': "center",
        '-webkit-box-align': "inherit"
      },
      '&-stretch': {
        'align-items': "stretch"
      },
      '&-end': {
        'align-items': "flex-end"
      }
    },
    '&--justify': {
      // left / top
      '&-start': {
        'justify-content': "flex-start"
      },
      '&-center': {
        'justify-content': "center"
      },
      '&-stretch': {
        'justify-content': "stretch"
      },
      // right / bottom
      '&-end': {
        'justify-content': "flex-end"
      }
    },
    '&--inline': {
      display: "inline-flex"
    },
    '&--1': {
      flex: "1"
    },
    '&--2': {
      flex: "2"
    },
    '&--3': {
      flex: "3"
    },
    '&--4': {
      flex: "4"
    } // '&__scroll': {
    // 	...templates.fill,
    // 	overflow    : `scroll`,
    // 	'&-vertical': {
    // 		...templates.fill,
    // 		'overflow-y'           : `scroll`,
    // 		'overflow-x'           : `hidden`,
    // 		'.flex-layout__content': {
    // 			...templates.fill,
    // 			bottom: `auto`,
    // 		},
    // 	},
    // 	'&-horizontal': {
    // 		...templates.fill,
    // 		'overflow-y'           : `hidden`,
    // 		'overflow-x'           : `scroll`,
    // 		'.flex-layout__content': {
    // 			...templates.fill,
    // 			right: `auto`,
    // 		},
    // 	},
    // },

  })]
}];