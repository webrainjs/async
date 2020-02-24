"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _endsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/ends-with"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _buttonsReset, _textboxReset;

var fontInherit = {
  'font-style': "inherit",
  'font-variant-ligatures': "inherit",
  'font-variant-caps': "inherit",
  'font-variant-numeric': "inherit",
  'font-variant-east-asian': "inherit",
  'font-weight': "inherit",
  'font-stretch': "inherit",
  'font-size': "100%",
  'line-height': "inherit",
  'font-family': "inherit"
};
var buttonAsDiv = (0, _extends2.default)({
  'align-items': "normal",
  'background-color': "transparent",
  'background-image': "none",
  'box-sizing': "inherit",
  color: "inherit",
  cursor: "auto",
  display: "block"
}, fontInherit, {
  'letter-spacing': "inherit",
  margin: "0",
  padding: "0",
  'text-align': "start",
  'text-indent': "0",
  'text-rendering': "inherit",
  'text-shadow': "inherit",
  'text-transform': "inherit",
  '-webkit-appearance': "inherit",
  '-webkit-font-smoothing': "inherit",
  '-webkit-writing-mode': "inherit",
  'word-spacing': "0",
  // Firefox
  border: "none",
  '-moz-appearance': "inherit",
  '-moz-osx-font-smoothing': "inherit",
  '-moz-user-select': "inherit",
  'overflow-clip-box': "inherit",
  'padding-block-end': "0",
  'padding-block-start': "0",
  'padding-inline-end': "0",
  'padding-inline-start': "0",
  'white-space': "normal",
  '&::-moz-focus-inner': {
    border: "0",
    padding: "0"
  },
  // IE
  overflow: "visible",
  zoom: "inherit",
  // Additional
  outline: "inherit",
  width: "100%"
});
var textboxAsDiv = (0, _extends2.default)({
  'background-color': "transparent",
  'background-image': "none",
  border: "none",
  'box-sizing': "inherit",
  display: "block",
  color: "inherit"
}, fontInherit, {
  'font-family': null,
  margin: "0",
  padding: "0",
  '-webkit-appearance': "none",
  width: "100%"
});

var anchorColor = function anchorColor(_ref) {
  var all = _ref.all,
      base = _ref.base,
      link = _ref.link,
      visited = _ref.visited,
      hover = _ref.hover,
      active = _ref.active;
  var result = {};

  if (all || base) {
    result.color = all || base;
  }

  if (all || link) {
    result['&:link'] = {
      color: all || link
    };
  }

  if (all || visited) {
    result['&:visited'] = {
      color: all || visited
    };
  }

  if (all || hover) {
    result['&:hover'] = {
      color: all || hover
    };
  }

  if (all || active) {
    result['&:active'] = {
      color: all || active
    };
  }

  return result;
};

var borders = function borders(_temp) {
  var _ref2 = _temp === void 0 ? {} : _temp,
      all = _ref2.all,
      left = _ref2.left,
      right = _ref2.right,
      top = _ref2.top,
      bottom = _ref2.bottom,
      color = _ref2.color,
      width = _ref2.width,
      style = _ref2.style;

  var result = {};

  if (all || left) {
    if (color) result['border-left-color'] = color;
    if (width) result['border-left-width'] = width;
    if (style) result['border-left-style'] = style;
  }

  if (all || right) {
    if (color) result['border-right-color'] = color;
    if (width) result['border-right-width'] = width;
    if (style) result['border-right-style'] = style;
  }

  if (all || top) {
    if (color) result['border-top-color'] = color;
    if (width) result['border-top-width'] = width;
    if (style) result['border-top-style'] = style;
  }

  if (all || bottom) {
    if (color) result['border-bottom-color'] = color;
    if (width) result['border-bottom-width'] = width;
    if (style) result['border-bottom-style'] = style;
  }

  return result;
};

var bordersInnerShadow = function bordersInnerShadow(_temp2) {
  var _ref3 = _temp2 === void 0 ? {} : _temp2,
      color = _ref3.color,
      width = _ref3.width;

  return color && width && {
    'box-shadow': "inset 0px 0px 0px " + width + " " + color
  };
};

var anchorAsDiv = (0, _extends2.default)({}, anchorColor({
  all: "inherit"
}), {
  'text-decoration': "inherit",
  width: "100%",
  display: "block"
});
var contentCenterButton = {
  'align-items': "center",
  'justify-content': "center",
  'text-align': "center"
};
var buttonsReset = (_buttonsReset = {}, _buttonsReset[["input[type='button']", "input[type='submit']", "input[type='reset']", "input[type='color']", "button"].join(',\n\t')] = [buttonAsDiv], _buttonsReset["input[type='file']::-webkit-file-upload-button"] = [(0, _extends2.default)({}, buttonAsDiv, {
  '&::-moz-focus-inner': null
})], _buttonsReset);
var textboxReset = (_textboxReset = {}, _textboxReset[["textarea", "input[type='text']", "input[type='email']", "input[type='password']", "select", "button"].join(',\n\t')] = [textboxAsDiv], _textboxReset);
var contentCenter = (0, _extends2.default)({}, contentCenterButton, {
  display: "flex"
});
var contentCenterVertical = {
  display: "flex",
  'align-items': "center",
  '-webkit-box-align': "inherit"
};
var fill = {
  position: "absolute",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0"
};
var inputHidden = {
  position: "absolute",
  clip: "rect(0,0,0,0)",
  'pointer-events': "none"
};

var aspectRatio = function aspectRatio(heightCoef) {
  return {
    // 'padding-top'   : `${heightCoef * 50}%`,
    'padding-bottom': heightCoef * 100 + "%"
  };
};

function icon(_ref4) {
  var url = _ref4.url,
      _ref4$x = _ref4.x,
      x = _ref4$x === void 0 ? 'center' : _ref4$x,
      _ref4$y = _ref4.y,
      y = _ref4$y === void 0 ? 'center' : _ref4$y,
      animation = _ref4.animation;
  return {
    'background-color': "transparent !important",
    'background-image': url && "url(" + url + ")",
    'background-position-x': x,
    'background-position-y': y,
    animation: animation
  };
}

function iconMask(_ref5) {
  var url = _ref5.url,
      _ref5$x = _ref5.x,
      x = _ref5$x === void 0 ? 'center' : _ref5$x,
      _ref5$y = _ref5.y,
      y = _ref5$y === void 0 ? 'center' : _ref5$y,
      _ref5$size = _ref5.size,
      size = _ref5$size === void 0 ? 'contain' : _ref5$size,
      _ref5$color = _ref5.color,
      color = _ref5$color === void 0 ? "white" : _ref5$color,
      animation = _ref5.animation;
  return {
    'mask-image': url && "url(" + url + ")",
    'mask-position': x + " " + y,
    'mask-size': "" + size,
    'background-color': color,
    // autoprefixer is not supported yet
    // see: https://github.com/postcss/autoprefixer/issues/1245
    '-webkit-mask-position-x': x,
    '-webkit-mask-position-y': y,
    animation: animation
  };
}

function noWrap(_temp3) {
  var _ref6 = _temp3 === void 0 ? {} : _temp3,
      _ref6$maxLines = _ref6.maxLines,
      maxLines = _ref6$maxLines === void 0 ? 1 : _ref6$maxLines,
      _ref6$lineHeightEm = _ref6.lineHeightEm,
      lineHeightEm = _ref6$lineHeightEm === void 0 ? void 0 : _ref6$lineHeightEm,
      _ref6$ellipsis = _ref6.ellipsis,
      ellipsis = _ref6$ellipsis === void 0 ? true : _ref6$ellipsis;

  var result = {};

  if (ellipsis) {
    result.overflow = "hidden";
    result['text-overflow'] = "ellipsis";
  }

  if (maxLines === 1) {
    (0, _assign.default)(result, {
      'white-space': "nowrap",
      'line-height': lineHeightEm && lineHeightEm + "em"
    });
  } else if (maxLines > 1) {
    (0, _assign.default)(result, {
      display: "-webkit-box",
      '-webkit-box-orient': "vertical",
      '-webkit-line-clamp': "" + maxLines,
      'line-height': lineHeightEm && lineHeightEm + "em",
      'max-height': maxLines * lineHeightEm + "em"
    });
  }

  return result;
}

var paddingAll = function paddingAll(value) {
  return {
    'padding-left': value,
    'padding-right': value,
    'padding-top': value,
    'padding-bottom': value
  };
};

var marginAll = function marginAll(value) {
  return {
    'margin-left': value,
    'margin-right': value,
    'margin-top': value,
    'margin-bottom': value
  };
};

var noSelect = {
  'user-drag': "none",
  'user-select': "none",
  '-moz-user-select': "none",
  '-webkit-user-drag': "none",
  '-webkit-user-select': "none",
  '-ms-user-select': "none"
};
var noDrag = {
  'user-drag': "none",
  '-webkit-user-drag': "none"
};

function important(style) {
  if (style == null || style === false) {
    return style;
  }

  if ((0, _isArray.default)(style)) {
    for (var i = 0, len = style.length; i < len; i++) {
      style[i] = important(style[i]);
    }

    return style;
  }

  if (typeof style === 'object') {
    for (var key in style) {
      if (Object.prototype.hasOwnProperty.call(style, key)) {
        style[key] = important(style[key]);
      }
    }

    return style;
  }

  style = style.toString();

  if ((0, _endsWith.default)(style).call(style, '!important')) {
    return style;
  }

  return style + " !important";
}

function transition(durationSec, includes, excludes) {
  var _context;

  if (includes === void 0) {
    includes = ['opacity', 'background-color', 'color', 'border-color', 'box-shadow', 'fill', 'fill-opacity', 'flood-color', 'flood-opacity', 'lighting-color', 'outline-color', 'stop-color', 'stop-opacity', 'stroke-opacity', 'text-decoration-color', 'text-shadow'];
  }

  if (excludes === void 0) {
    excludes = [];
  }

  return {
    transition: (0, _concat.default)(_context = (0, _map.default)(includes).call(includes, function (o) {
      return o + " " + durationSec + "s";
    })).call(_context, (0, _map.default)(excludes).call(excludes, function (o) {
      return o + " 0";
    })).join(', ')
  };
}

module.exports = (0, _extends2.default)({
  buttonAsDiv: buttonAsDiv,
  buttonsReset: buttonsReset,
  textboxAsDiv: textboxAsDiv,
  textboxReset: textboxReset,
  anchorAsDiv: anchorAsDiv,
  contentCenter: contentCenter,
  contentCenterVertical: contentCenterVertical,
  contentCenterButton: contentCenterButton,
  inputHidden: inputHidden,
  fill: fill,
  aspectRatio: aspectRatio,
  icon: icon,
  iconMask: iconMask,
  anchorColor: anchorColor,
  borders: borders,
  bordersInnerShadow: bordersInnerShadow,
  noWrap: noWrap,
  noSelect: noSelect,
  noDrag: noDrag,
  paddingAll: paddingAll,
  marginAll: marginAll,
  important: important,
  transition: transition
}, require('./colors'), {}, require('./layouts'), {}, require('./fonts'));