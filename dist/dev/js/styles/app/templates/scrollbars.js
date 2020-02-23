"use strict";

function scrollbars(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$width = _ref.width,
      width = _ref$width === void 0 ? "0.5em" : _ref$width,
      _ref$padding = _ref.padding,
      padding = _ref$padding === void 0 ? "0.5em" : _ref$padding,
      _ref$minWidth = _ref.minWidth,
      minWidth = _ref$minWidth === void 0 ? "2px" : _ref$minWidth,
      _ref$backgroundColor = _ref.backgroundColor,
      backgroundColor = _ref$backgroundColor === void 0 ? "transparent" : _ref$backgroundColor,
      _ref$thumbColor = _ref.thumbColor,
      thumbColor = _ref$thumbColor === void 0 ? "rgba(255, 255, 255, .2)" : _ref$thumbColor;

  return {
    '&::-webkit-scrollbar': {
      '-webkit-appearance': "none",
      width: "calc(" + width + " + " + padding + " * 2)",
      height: "calc(" + width + " + " + padding + " * 2)",
      'min-width': "calc(" + minWidth + " + " + padding + " * 2)",
      'min-height': "calc(" + minWidth + " + " + padding + " * 2)"
    },
    '&::-webkit-scrollbar:vertical': {},
    '&::-webkit-scrollbar:horizontal': {},
    '&::-webkit-scrollbar-thumb': {
      'border-radius': "calc(" + width + " + " + padding + " * 2)",
      'background-color': thumbColor,
      'border-color': "transparent",
      'border-style': "solid",
      'border-width': "" + padding,
      'background-clip': "padding-box"
    },
    '&::-webkit-scrollbar-track': {
      'background-color': backgroundColor,
      margin: "calc(0 - " + padding + ")"
    },
    '&::-webkit-scrollbar-corner': {
      display: "none",
      background: "transparent"
    }
  };
}

module.exports = {
  base: scrollbars
};