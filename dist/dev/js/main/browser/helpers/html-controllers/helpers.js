"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.createHtmlElementMatches = createHtmlElementMatches;
exports.getPatentElement = getPatentElement;

var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

function createHtmlElementMatches(_ref) {
  var tagNames = _ref.tagNames,
      classNames = _ref.classNames,
      selector = _ref.selector;
  return function (element) {
    if (tagNames) {
      if (typeof tagNames === 'string') {
        if (element.nodeName === tagNames) {
          return true;
        }
      } else if ((0, _indexOf.default)(tagNames).call(tagNames, element.nodeName) >= 0) {
        return true;
      }
    }

    if (classNames) {
      if (typeof classNames === 'string') {
        if (element.classList.contains(classNames)) {
          return true;
        }
      } else if ((0, _some.default)(classNames).call(classNames, function (className) {
        return element.classList.contains(className);
      })) {
        return true;
      }
    }

    if (selector && element.matches(selector)) {
      return true;
    }

    return false;
  };
}

function getPatentElement(element, matchesFunc) {
  while (element && !matchesFunc(element)) {
    element = element.parentElement;
  }

  return element;
}