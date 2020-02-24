"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _templates = _interopRequireDefault(require("../../helpers/templates"));

var _colors = _interopRequireDefault(require("./colors"));

var base = function base(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      all = _ref.all,
      left = _ref.left,
      right = _ref.right,
      top = _ref.top,
      bottom = _ref.bottom,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? _colors.default.border.base : _ref$color,
      _ref$width = _ref.width,
      width = _ref$width === void 0 ? '1.5px' : _ref$width,
      _ref$style = _ref.style,
      style = _ref$style === void 0 ? 'solid' : _ref$style;

  return _templates.default.borders({
    all: all,
    left: left,
    right: right,
    top: top,
    bottom: bottom,
    color: color,
    width: width,
    style: style
  });
};

var template = function template(_temp2) {
  var _ref2 = _temp2 === void 0 ? {} : _temp2,
      _ref2$color = _ref2.color,
      color = _ref2$color === void 0 ? _colors.default.border.base : _ref2$color,
      _ref2$width = _ref2.width,
      width = _ref2$width === void 0 ? '1.5px' : _ref2$width,
      _ref2$style = _ref2.style,
      style = _ref2$style === void 0 ? 'solid' : _ref2$style;

  return {
    '&-all': base({
      all: true,
      color: color,
      width: width,
      style: style
    }),
    '&-left': base({
      left: true,
      color: color,
      width: width,
      style: style
    }),
    '&-right': base({
      right: true,
      color: color,
      width: width,
      style: style
    }),
    '&-top': base({
      top: true,
      color: color,
      width: width,
      style: style
    }),
    '&-bottom': base({
      bottom: true,
      color: color,
      width: width,
      style: style
    })
  };
};

var innerShadow = function innerShadow(_temp3) {
  var _ref3 = _temp3 === void 0 ? {} : _temp3,
      _ref3$color = _ref3.color,
      color = _ref3$color === void 0 ? _colors.default.border.base : _ref3$color,
      _ref3$width = _ref3.width,
      width = _ref3$width === void 0 ? '1.5px' : _ref3$width;

  return _templates.default.bordersInnerShadow({
    color: color,
    width: width
  });
};

module.exports = {
  base: base,
  innerShadow: innerShadow,
  template: template
};