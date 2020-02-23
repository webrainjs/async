"use strict";

/* tslint:disable:quotemark no-duplicate-string */
function fontFamily(_ref) {
  var family = _ref.family,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 1 : _ref$size,
      _ref$offsetY = _ref.offsetY,
      offsetY = _ref$offsetY === void 0 ? 0.016 : _ref$offsetY,
      _ref$lineHeight = _ref.lineHeight,
      lineHeight = _ref$lineHeight === void 0 ? null : _ref$lineHeight,
      _ref$lineHeightNormal = _ref.lineHeightNormalize,
      lineHeightNormalize = _ref$lineHeightNormal === void 0 ? 1 / size : _ref$lineHeightNormal;
  var lineHeightCalc = lineHeightNormalize == null ? lineHeight : (lineHeight || 1) * lineHeightNormalize;
  return {
    '.text': {
      'font-family': family,
      'font-size': size * 100 + "%",
      'line-height': lineHeightCalc,
      // > 1 ? lineHeightCalc : null,
      'vertical-align': -offsetY / size + "em"
    },
    '.font': {
      'font-family': family
    },
    '&.font': {
      'font-family': family // 'font-size': `${size * 100}%`,
      // 'line-height': lineHeightCalc, // > 1 ? lineHeightCalc : null,
      // 'vertical-align': `${-offsetY}em`,
      // 'margin-top': `${offsetY}em`,
      // 'margin-bottom': `${-offsetY}em`,

    }
  };
}

var arial = fontFamily({
  family: 'Arial',
  size: 0.948
});
var tahoma = fontFamily({
  family: 'Tahoma',
  size: 0.933,
  lineHeightNormalize: null
});
var timesNewRoman = fontFamily({
  family: 'Times New Roman',
  size: 1,
  offsetY: 0
});
module.exports = {
  fontFamily: fontFamily,
  fonts: {
    arial: arial,
    tahoma: tahoma,
    timesNewRoman: timesNewRoman
  }
};