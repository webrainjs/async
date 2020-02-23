"use strict";

exports.__esModule = true;
exports.calcRelativeFontSize = calcRelativeFontSize;
exports.setRelativeFontSize = setRelativeFontSize;

var _ppi = require("./ppi");

function calcRelativeFontSize(container, coef) {
  if (coef === void 0) {
    coef = 1.0;
  }

  var fontSize = Math.min(container.offsetWidth, container.offsetHeight) / 480 * (0, _ppi.getPPI)() / 96 * 10 * coef;
  console.log("ppi = " + (0, _ppi.getPPI)() + "; width = " + container.offsetWidth + "; height = " + container.offsetHeight + "; fontSize = " + fontSize);
  return fontSize;
}

function setRelativeFontSize(container, coef) {
  if (coef === void 0) {
    coef = 1.0;
  }

  var fontSize = calcRelativeFontSize(container, coef);
  container.style.fontSize = fontSize + "px";
  return fontSize;
}