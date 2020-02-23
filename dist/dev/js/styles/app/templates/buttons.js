"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _templates = _interopRequireDefault(require("../../helpers/templates"));

var _borders = _interopRequireDefault(require("./borders"));

var _color = _interopRequireDefault(require("color"));

var background = function background(_ref) {
  var color = _ref.color;
  return {
    'background-color': color
  };
};

var border = function border(_ref2) {
  var _ref2$color = _ref2.color,
      color = _ref2$color === void 0 ? 'transparent' : _ref2$color,
      _ref2$width = _ref2.width,
      width = _ref2$width === void 0 ? "1.5px" : _ref2$width;
  return (0, _extends2.default)({}, color && width && _borders.default.innerShadow({
    color: color,
    width: width
  }));
};

var text = function text(_ref3) {
  var color = _ref3.color;
  return (0, _extends2.default)({}, color && _templates.default.anchorColor({
    all: color
  }), {
    '&__icon': {
      'background-color': color
    }
  });
};

var base = function base(_temp) {
  var _ref4 = _temp === void 0 ? {} : _temp,
      _ref4$noWrap = _ref4.noWrap,
      noWrap = _ref4$noWrap === void 0 ? true : _ref4$noWrap,
      _ref4$colorBackground = _ref4.colorBackground,
      colorBackground = _ref4$colorBackground === void 0 ? 'transparent' : _ref4$colorBackground,
      _ref4$colorBorder = _ref4.colorBorder,
      colorBorder = _ref4$colorBorder === void 0 ? 'transparent' : _ref4$colorBorder,
      _ref4$borderWidth = _ref4.borderWidth,
      borderWidth = _ref4$borderWidth === void 0 ? "1.5px" : _ref4$borderWidth,
      _ref4$hover = _ref4.hover,
      hover = _ref4$hover === void 0 ? {
    opacity: 0.75,
    colorBackground: void 0,
    colorBorder: void 0,
    borderWidth: void 0
  } : _ref4$hover,
      _ref4$disabled = _ref4.disabled,
      disabled = _ref4$disabled === void 0 ? {
    opacity: 0.5,
    colorBackground: void 0,
    colorBorder: void 0,
    borderWidth: void 0
  } : _ref4$disabled,
      _ref4$active = _ref4.active,
      active = _ref4$active === void 0 ? {
    opacity: 0.5,
    colorBackground: void 0,
    colorBorder: void 0,
    borderWidth: void 0
  } : _ref4$active;

  return [_templates.default.anchorAsDiv, _templates.default.buttonAsDiv, (0, _extends2.default)({}, _templates.default.contentCenter, {}, noWrap && _templates.default.noWrap(), {
    display: "inline-flex",
    width: "auto"
  }, background({
    color: colorBackground
  }), {}, border({
    color: colorBorder,
    width: borderWidth
  }), {
    '&:disabled': (0, _extends2.default)({}, background({
      color: disabled.colorBackground
    }), {}, (disabled.colorBorder || disabled.borderWidth) && border({
      color: disabled.colorBorder || colorBorder,
      width: disabled.borderWidth || borderWidth
    }), {
      opacity: disabled.opacity,
      'pointer-events': "none"
    }),
    '&:hover': (0, _extends2.default)({}, background({
      color: hover.colorBackground
    }), {}, (hover.colorBorder || hover.borderWidth) && border({
      color: hover.colorBorder || colorBorder,
      width: hover.borderWidth || borderWidth
    }), {
      opacity: hover.opacity
    }),
    '&:active': (0, _extends2.default)({}, background({
      color: active.colorBackground
    }), {}, (active.colorBorder || active.borderWidth) && border({
      color: active.colorBorder || colorBorder,
      width: active.borderWidth || borderWidth
    }), {
      opacity: active.opacity
    }),
    'user-select': "none",
    cursor: "pointer",
    '&, &:before, &:after': (0, _extends2.default)({}, _templates.default.transition(0.5))
  })];
};

var withText = function withText(_temp2) {
  var _ref5 = _temp2 === void 0 ? {} : _temp2,
      _ref5$noWrap = _ref5.noWrap,
      noWrap = _ref5$noWrap === void 0 ? true : _ref5$noWrap,
      _ref5$colorBackground = _ref5.colorBackground,
      colorBackground = _ref5$colorBackground === void 0 ? 'transparent' : _ref5$colorBackground,
      _ref5$colorText = _ref5.colorText,
      colorText = _ref5$colorText === void 0 ? (0, _color.default)(colorBackground).hsl().color[2] > 0.5 ? "#000" : "#fff" : _ref5$colorText,
      _ref5$colorBorder = _ref5.colorBorder,
      colorBorder = _ref5$colorBorder === void 0 ? 'transparent' : _ref5$colorBorder,
      _ref5$borderWidth = _ref5.borderWidth,
      borderWidth = _ref5$borderWidth === void 0 ? "1.5px" : _ref5$borderWidth,
      _ref5$hover = _ref5.hover,
      hover = _ref5$hover === void 0 ? {
    opacity: 0.75,
    colorText: void 0,
    colorBackground: void 0,
    colorBorder: void 0,
    borderWidth: void 0
  } : _ref5$hover,
      _ref5$disabled = _ref5.disabled,
      disabled = _ref5$disabled === void 0 ? {
    opacity: 0.5,
    colorText: void 0,
    colorBackground: void 0,
    colorBorder: void 0,
    borderWidth: void 0
  } : _ref5$disabled,
      _ref5$active = _ref5.active,
      active = _ref5$active === void 0 ? {
    opacity: 0.5,
    colorText: void 0,
    colorBackground: void 0,
    colorBorder: void 0,
    borderWidth: void 0
  } : _ref5$active;

  return [base({
    noWrap: noWrap,
    colorBackground: colorBackground,
    colorBorder: colorBorder,
    borderWidth: borderWidth,
    hover: hover,
    disabled: disabled,
    active: active
  }), (0, _extends2.default)({}, text({
    color: colorText
  })), {
    'padding-left': "0.3em",
    'padding-right': "0.3em",
    '&:disabled': (0, _extends2.default)({}, text({
      color: disabled.colorText
    })),
    '&:hover': (0, _extends2.default)({}, text({
      color: hover.colorText
    })),
    '&:active': (0, _extends2.default)({}, text({
      color: active.colorText
    }))
  }];
};

module.exports = {
  background: background,
  border: border,
  text: text,
  base: base,
  withText: withText
};